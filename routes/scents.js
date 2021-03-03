var express = require('express');
var router = express.Router();
var Parfumes = require('../models/parfumes')
var Abonaments = require('../models/abonaments')
var Subscriptions = require('../models/subscriptions')
var User = require('../models/user')
const mongoc = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID
var Orders = require('../models/orders');
var Suggestions = require('../models/suggestions');

const { response } = require('express');
const abonaments = require('../models/abonaments');
const { ObjectID } = require('mongodb');
if(process.env.NODE_ENV !=='production'){
  require('dotenv').config()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripe = require('stripe')(stripeSecretKey)
const product_number = 10;
module.exports = function(io){
  /* GET home page. */
  function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/users/login')
  }
  function ensureVerified(req, res, next){
    if(req.isAuthenticated() && req.user.status == 'verified'){
      return next();
    }
    req.flash('Please verify your account!')
    res.redirect('/')
  }
  function ensureNotAuthenticated(req, res, next){
    if(!req.isAuthenticated()){
      return next();
    }
    res.redirect('/')
  }
  router.get('/', function(req, res, next) {
    res.render('scents', { input: 'none'});
  });
  router.get('/loggedinfromcart', function(req, res, next) {
    res.render('loggedinfromcart', {})
  });
  router.get('/cart', function(req, res, next) {
   // console.log(stripeSecretKey)
   // console.log('\n\n\n\n');
    if(req.user){
      var ids = []
        User.getCart(req.user.username, ( parfarr, abarr)=>{
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
              
            })
           
            stripe.products.list({
              limit: product_number,
            }).then(data_stripe => {
              Parfumes.find({}, (err, allparfumes)=>{
                  console.log(allparfumes)
                  res.render('cart', {allscents: allparfumes, stripePublicKey: stripePublicKey, cart: parfarr,ids: ids, stripe: data_stripe.data});
  
                
              })
  
            })

          } else {
            res.status(500).end()
          }
        })
    } else {
      res.render('cart', {});
    }
   
  });

  router.post('/done', ensureVerified, function(req,res,next){
    console.log(req.get('host'))
    var cando = process.env.NODE_ENV !=='production' ? true : (req.get('host') == 'www.ascentperfumes.com')
    console.log(cando)
    if(req.user && cando){
      console.log('BODY')
      let total = 0
      let cartids = []
      var qs = {}
      console.log(req.body)
      var items = req.body.items
      var itemsnumber = 0;
      req.body.items.forEach(item=>{
        cartids.push(item.id)
        itemsnumber+=Number(item.quantity)
        qs[item.id] = item.quantity;
      })
      console.log('ITEMCOUNT: '+ itemsnumber)
      console.log(req.body)
      //console.log(stripePublicKey, stripeSecretKey
      Parfumes.find({_id: {$in : cartids}}, (err, parfumes)=>{
        if(err) throw err;
        var i=0;
        parfumes.forEach(doc=>{
          total+=doc.price * qs[doc._id];
        })
        const chargeMe = ()=>{
          //console.log(req.body.stripeTokenId)
          var discount = 0;
          if(itemsnumber == 2){
            discount = 10;
          } else if(itemsnumber == 3){
            discount = 15;
          }
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
            products: items,
            deliverymethod: req.body.deliverymethod,
            discountPercentage: discount,
            itemCount: itemsnumber
            
          }),(err,ordercr)=>{
            User.emptyCart(req.user.username, (err2, result)=>{
              console.log(err)
              if(!err){
                console.log('Charge Succesfull ')
                console.log(result)
                res.json({error: false, message:'Successfully ordered!', order: ordercr})
              } else {
                console.log('Charge Failed ')
                console.log(result)
                res.json({error: true, message:'Something went wrong!'})
              }
            })
            
    
          
            //add to db
          })
          
          
          
        }
        if(req.user){
          chargeMe()

          //
          
          //        
        } 
      })
        
        

        
      
    }else {
      res.redirect('/')
    }
  })
  /*router.post('/done', function(req,res,next){
    if(req.user){
      console.log('BODY')
      console.log(req.body)
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
          var objIds = []
          var i=0;
          if(req.body.abonamentsIds != []){
            req.body.abonamentsIds.forEach(abid=>{
              objIds[i]=new ObjectID()
              i++;
            })
            i=-1;
            req.body.abonamentsIds.forEach(abid=>{
              
              console.log('IDS:')
              console.log(objIds[i])
              Abonaments.findById( abid, (err, abon)=>{
                i++;
                console.log(err, abon)
                console.log('AAAAAAAAAAAAAAAAAAAAAAAA')
                console.log(i)
                Subscriptions.create(new Subscriptions({
                  _id: objIds[i],
                  userID: req.user._id,
                  abonamentID: abid,
                  parfumes: req.body.parfumeChoices[abid].slice(0, abon.parfumeChoices)
                }), (err2, result)=>{
                  console.log(err2, result)
                })
              })
              
            })
            
          }
          Abonaments.find({_id:{$in:req.body.abonamentsIds}}, (err, docs)=>{
            var abonamentprice = 0
            docs.forEach(d=>{
              abonamentprice+=d.price
            })
            var items = []
            Parfumes.find({}, (error, parfumes)=>{
              req.body.items.forEach(item=>{
                items.push({
                  id: item.id,
                  quantity: item.quantity,
                  price: parfumes.find(el => el._id == item.id).price
                })
              })
              console.log(items)
              Orders.create(new Orders({
                amount: total+abonamentprice,
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
                products: items,
                status: 'sent',
                deliverymethod: req.body.deliverymethod,
                subscriptionsId: objIds
                
              }),(err,ordercr)=>{
                User.emptyCart(req.user.username, (err2, result)=>{
                  console.log(err)
                  if(!err){
                    console.log('Charge Succesfull ')
                    console.log(result)
                    res.json({error: false, message:'Successfully ordered!', order: ordercr})
                  } else {
                    console.log('Charge Failed ')
                    console.log(result)
                    res.json({error: false, message:'Something went wrong!'})
                  }
                })
                
         
               
                //add to db
              })
            })
           
          })
          
          
        }
        if(req.user){
          chargeMe()

          //
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
          //        
        } 

        
      })
    }else {
      res.render('youneedlogin', {input: 'purchase'})
    }
    
  })
*/
  router.post('/suggest', function(req, res , next){
    Suggestions.create(new Suggestions({
      email: req.body.email,
      suggestion: req.body.suggestion
    }), (err, suggcr)=>{
      req.flash('success','Thank you for your feedback!')
      res.redirect('/scents/men')
    })
  })
  router.get('/cancelorder/:orderid',ensureVerified,  function(req,res,next){
    if(req.user){

    
      Orders.findById(req.params.orderid, (err, order)=>{
        console.log(order)
        if(order){
          console.log(order.userID, req.user._id)
          if(`${order.userID}`==`${req.user._id}`){
            Orders.cancelOrder(req.params.orderid, ()=>{
              req.flash('success', 'Order canceled!')
              res.redirect('/myaccount/orders')
            })
  
          } else {
            req.flash('error', 'Order could not be canceled!')
            res.redirect('/myaccount/orders')
          }
        } else {
          req.flash('error', 'Order not found!')
            res.redirect('/myaccount/orders')
        }
        
      })
    } else {
      res.redirect('/')
    }
  })
  router.get('/:query', function(req, res, next) {
      /* retrieve queryed elems */
      if(req.params.query == 'men'){
        var men;
        Parfumes.getMen((err, data)=>{
          men = data
          console.log('MEEEEN')
          console.log(men)
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
              res.render('scents', {input: req.params.query, title: 'Women', scents: women, stripe: data_stripe.data});
  
            })


        })
        
      } else{
        res.redirect('/')
      } /*if(req.params.query == 'subscriptions'){
          var scents
          
          Parfumes.find({},(err, data)=>{
            scents = data
              stripe.products.list({
                limit: product_number,
              }).then(data_stripe => {
                Abonaments.find({}, (err2, data_abonaments)=>{
                  if(err || err2){
                    res.render('404')
                  } else {
                    console.log('----ABONAMENTS----')
                    console.log(data_abonaments)
                    res.render('abonaments', { input: req.params.query, title: 'Abonaments', scents: scents, abonaments: data_abonaments, stripe: data_stripe.data});
  
                  }
                })
  
              })
            

          })
      }*/
  });
  mongoc.connect('mongodb+srv://root:Adrianecelmaiboss@cluster0-6ijeg.mongodb.net/ascent?retryWrites=true&w=majority', function(err, db){
    io.on('connection', socket =>{
      console.log('wfefgqrgwe')
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
      /*socket.on('add-to-cart-abonament',(user, parfume) =>{
        console.log('steau e numai unaa /n/n')
        User.addToAbonCart(user, parfume, (res)=>{
          console.log(res)
        })
      })
      socket.on('remove-from-cart-abonament',(user, parfume) =>{
        console.log('steau e numai unaa /n/n')
        User.removeFromAbonCart(user, parfume, (res)=>{
          console.log(res)
        })
      })*/
      socket.on('set-abonament',(user, parfume) =>{
        console.log('steau e numai unaa /n/n')
        User.setAbonCart(user, parfume, (res)=>{
          console.log(res)
        })
      })
    })
  })
  
  return router;
}