var express = require('express');
var router = express.Router();
var Parfumes = require('../models/parfumes')
var User = require('../models/user')
const mongoc = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID
if(process.env.NODE_ENV !=='production'){
  require('dotenv').config()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripe = require('stripe')(stripeSecretKey)

module.exports = function(io){
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('scents', { input: 'none'});
  });
  router.get('/cart', function(req, res, next) {
   // console.log(stripeSecretKey)
   // console.log('\n\n\n\n');
    if(req.user){
      var ids = []
        User.getCart(req.user.username, ( parfarr)=>{
          var parfarrnoid = []
          if(true){
            console.log('\n\n\n\n\n\n pfar')
            parfarr.forEach(el=>{
              var cop = {};
              ids.push(el._id)
              delete el._doc._id
              for (const [key, value] of Object.entries(el._doc)) {
                if(key !== '_id'){
                  cop[key] = value
                }
              }
              console.log('\N\N\NNO ID:')
              console.log(cop)
              parfarrnoid.push(cop)
            })
            console.log(parfarrnoid, parfarr)
            res.render('cart', { stripePublicKey: stripePublicKey, cart: parfarr, ids: ids});

          } else {
            res.status(500).end()
          }
        })
    } else {
      res.redirect('/users/login')
    }
   
  });
  router.post('/purchase', function(req,res,next){
    if(req.user){
      console.log('purchase')
      console.log(stripePublicKey, stripeSecretKey)
      let total = 0
      let cartids = []
      var qs = {}
      req.body.items.forEach(item=>{
        cartids.push(item.id)
        qs[item.id] = item.quantity;
      })
      Parfumes.find({ _id : { $in: cartids } },(err, parfumes)=>{
        if(err) throw err
        console.log('\nParfumes: ')
        console.log(parfumes)
        var i = 0
        parfumes.forEach(doc=>{
          total+=doc.price * qs[doc._id];
        })
        const chargeMe = ()=>{
          console.log(req.body.stripeTokenId)
          stripe.customers.createSource(req.user.stripeCustomerID, {
            source: req.body.stripeTokenId
          }).then(s=>{
            
            stripe.paymentIntents.create({
              amount: total,
              currency: 'usd',
              customer: req.user.stripeCustomerID,
              receipt_email: req.user.email,
              confirm: true,
              shipping: {
                address: {
                  line1: JSON.parse(req.user.addresses[0]).street,
                  city: JSON.parse(req.user.addresses[0]).city,
                  country: JSON.parse(req.user.addresses[0]).country,
                  postal_code: JSON.parse(req.user.addresses[0]).zip,
                  state: JSON.parse(req.user.addresses[0]).state ? JSON.parse(req.user.addresses[0]).state: JSON.parse(req.user.addresses[0]).county
                },
                name: `${req.user.name} ${req.user.vorname}`
              }
            }).then(()=>{
              console.log('Charge Succesfull')
              res.json({message:'Successfully purchased!'})
              
              //add to db
            }).catch((err)=>{
              console.log(err)
              console.log('Charge Failed')
              res.json({message:'Something went wrong!'})
    
              //res.status(500).end()
            })
          }).catch((err)=>{
            console.log(err)
            console.log('Source Failed')
            res.json({message:'Something went wrong!'})
  
            //res.status(500).end()
          })
        }
        if(req.user){
          if(!req.user.stripeCustomerID){
            //customer not reqistered
            //const customer = await stripe.customers.create({email: req.user.email});
            stripe.customers.create({email: req.user.email}).then((customer)=>{
              User.updateOne({username: req.user.username}, {
                $set: {stripeCustomerID: customer.id}
              }).then((err,res)=>{
                chargeMe()
              })
            })
          }
        }
        chargeMe()
      })
    }else {
      res.render('youneedlogin', {input: 'purchase'})
    }
    
  })
  router.get('/:query', function(req, res, next) {
      /* retrieve queryed elems */
      if(req.params.query == 'men'){
        var men;
        Parfumes.getMen((err, data)=>{
          men = data
          console.log('MEEEEN')
          console.log(JSON.stringify(men))
          res.render('scents', { input: req.params.query, title: 'Men', scents: men});

        })
        
        
      } else if(req.params.query == 'women'){
        var women;
        Parfumes.getWomen((err, data)=>{
          women = data
          res.render('scents', { input: req.params.query, title: 'Women', scents: women});

        })
        
      }
  });
  mongoc.connect('mongodb+srv://root:Adrianecelmaiboss@cluster0-6ijeg.mongodb.net/ascent?retryWrites=true&w=majority', function(err, db){
    io.on('connection', socket =>{
      socket.on('add-to-cart',(user, parfume) =>{
        console.log('steau e numai unaa /n/n')
        User.addToCart(user, parfume, (res)=>{
          console.log(res)
        })
      })
      socket.on('remove-from-cart',(user, parfume) =>{
        console.log('steau e numai unaa /n/n')
        User.removeFromCart(user, parfume, (res)=>{
          console.log(res)
        })
      })
    })
  })
  
  return router;
}