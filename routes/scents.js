var express = require('express');
var router = express.Router();
var Parfumes = require('../models/parfumes')
var User = require('../models/user')
const mongoc = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID
var Orders = require('../models/orders')
if(process.env.NODE_ENV !=='production'){
  require('dotenv').config()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripe = require('stripe')(stripeSecretKey)
const product_number = 10;
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
            stripe.products.list({
              limit: product_number,
            }).then(data_stripe => {
              res.render('cart', { stripePublicKey: stripePublicKey, cart: parfarr, ids: ids, stripe: data_stripe.data});
  
            })

          } else {
            res.status(500).end()
          }
        })
    } else {
      res.redirect('/users/login')
    }
   
  });

  router.post('/done', function(req,res,next){
    if(req.user){
      console.log('done')
      //console.log(stripePublicKey, stripeSecretKey)
      let total = 0
      let cartids = []
      var qs = {}
      console.log(req.body)
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
          Orders.create(new Orders({
            amount: total,
            currency: 'usd',
            userID: req.user._id,
            email: req.user.email,
            shipping: {
              address: {
                line1: JSON.parse(req.user.addresses[req.body.addressnr]).street,
                city: JSON.parse(req.user.addresses[req.body.addressnr]).city,
                country: JSON.parse(req.user.addresses[req.body.addressnr]).country,
                postal_code: JSON.parse(req.user.addresses[req.body.addressnr]).zip,
                state: JSON.parse(req.user.addresses[req.body.addressnr]).state ? JSON.parse(req.user.addresses[req.body.addressnr]).state: JSON.parse(req.user.addresses[req.body.addressnr]).county
              },
              name: `${req.user.name} ${req.user.vorname}`
            },
            products: req.body.items,
            status: 'sent',
            deliverymethod: req.body.deliverymethod
            
          }),(err,result)=>{
            console.log(err)
            if(!err){
              console.log('Charge Succesfull ')
              console.log(result)
              res.json({error: false, message:'Successfully ordered! Price will be ' + total/100 +' lei!'})
            } else {
              console.log('Charge Failed ')
              console.log(result)
              res.json({error: false, message:'Something went wrong!'})
            }
     
           
            //add to db
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
          } else {
            chargeMe()

          }
        } 

        
      })
    }else {
      res.render('youneedlogin', {input: 'purchase'})
    }
    
  })

  router.post('/purchase', function(req,res,next){
    if(req.user){
      console.log('purchase')
      console.log(stripePublicKey, stripeSecretKey)
      let total = 0
      let cartids = []
      var qs = {}
      console.log(req.body)
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
          stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
            customer: req.user.stripeCustomerID,
            receipt_email: req.user.email,
            shipping: {
              address: {
                line1: JSON.parse(req.user.addresses[0]).street,
                city: JSON.parse(req.user.addresses[0]).city,
                country: JSON.parse(req.user.addresses[0]).country,
                postal_code: JSON.parse(req.user.addresses[0]).zip,
                state: JSON.parse(req.user.addresses[0]).state ? JSON.parse(req.user.addresses[0]).state: JSON.parse(req.user.addresses[0]).county
              },
              name: `${req.user.name} ${req.user.vorname}`
            },
            metadata: {
              products: JSON.stringify(req.body.items)
            }
          }).then((intent)=>{
            console.log('Charge Succesfull ' + intent.client_secret)
            console.log(intent)
            res.json({error: false, message:'Successfully purchased!', client_secret: intent.client_secret, customerID: req.user.stripeCustomerID})
           
            //add to db
          }).catch((err)=>{
            console.log(err)
            console.log('Charge Failed')
            res.json({message:'Something went wrong!', error: true})
  
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
          stripe.products.list({
            limit: product_number,
          }).then(data_stripe => {
            console.log(data_stripe)
            res.render('scents', { input: req.params.query, title: 'Men', scents: men, stripe: data_stripe.data});

          });

        })
        
        
      } else if(req.params.query == 'women'){
        var women;
        Parfumes.getWomen((err, data)=>{
          women = data
          stripe.products.list({
            limit: product_number,
          }).then(data_stripe => {
            res.render('scents', { input: req.params.query, title: 'Women', scents: women, stripe: data_stripe.data});

          })

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