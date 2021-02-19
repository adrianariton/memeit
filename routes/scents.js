var express = require('express');
var router = express.Router();
var Parfumes = require('../models/parfumes')
var Abonaments = require('../models/abonaments')
var Subscriptions = require('../models/subscriptions')
var User = require('../models/user')
const mongoc = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID
var Orders = require('../models/orders');
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
  router.get('/', function(req, res, next) {
    res.render('scents', { input: 'none'});
  });
  router.get('/cart', function(req, res, next) {
   // console.log(stripeSecretKey)
   // console.log('\n\n\n\n');
    if(req.user){
      var ids = []
      var abids = []
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
            abarr.forEach(el=>{
              var cop = {};
              abids.push(el._id)
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
                Abonaments.findById(req.user.m_abonamentCart, (err, uabon)=>{
                  console.log(allparfumes)
                  res.render('cart', {abon: uabon, allscents: allparfumes, stripePublicKey: stripePublicKey, cart: parfarr,abids: abids, ids: ids, stripe: data_stripe.data, abcart: abarr});
  
                })
                
              })
  
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
      console.log('BODY')
      console.log(req.body)
      //console.log(stripePublicKey, stripeSecretKey
      var abid = req.user.m_abonamentCart
      console.log(abid)
        const chargeMe = ()=>{
          //console.log(req.body.stripeTokenId)
          var Obid = new ObjectID()
          console.log('HCGSJWBLBPRJ3', Obid)
          Subscriptions.create(new Subscriptions({
            _id: Obid,
            userID: req.user._id,
            abonamentID: abid,
            parfumes: req.user.cart
          }), (err2, result)=>{
            console.log('err2')
            console.log(err2, result)
            console.log('res')
            Abonaments.findById(abid, (err3, abon)=>{
              Orders.create(new Orders({
                amount: abon.price,
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
                products: [],
                status: 'sent',
                deliverymethod: req.body.deliverymethod,
                subscriptionsId: Obid
                
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
          
          //        
        } 

        
      
    }else {
      res.render('youneedlogin', {input: 'purchase'})
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
  router.post('/purchase', function(req,res,next){
    if(false){
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
          Subscriptions.findOne({userID: req.user? req.user._id: null}, (error, usersub)=>{
            stripe.products.list({
              limit: product_number,
            }).then(data_stripe => {
              console.log(data_stripe)
              res.render('scents', { subscription: usersub, input: req.params.query, title: 'Men', scents: men, stripe: data_stripe.data});
  
            });
          })

        })
        
        
      } else if(req.params.query == 'women'){
        var women;
        Parfumes.getWomen((err, data)=>{
          women = data
          Subscriptions.findOne({userID: req.user? req.user._id: null}, (error, usersub)=>{
            stripe.products.list({
              limit: product_number,
            }).then(data_stripe => {
              res.render('scents', {subscription: usersub, input: req.params.query, title: 'Women', scents: women, stripe: data_stripe.data});
  
            })
          })


        })
        
      } else if(req.params.query == 'subscriptions'){
          var scents
          
          Parfumes.find({},(err, data)=>{
            scents = data
            Subscriptions.findOne({userID: req.user? req.user._id: null}, (error, usersub)=>{
              stripe.products.list({
                limit: product_number,
              }).then(data_stripe => {
                Abonaments.find({}, (err2, data_abonaments)=>{
                  if(err || err2){
                    res.render('404')
                  } else {
                    console.log('----ABONAMENTS----')
                    console.log(data_abonaments)
                    res.render('abonaments', { subscription: usersub,input: req.params.query, title: 'Abonaments', scents: scents, abonaments: data_abonaments, stripe: data_stripe.data});
  
                  }
                })
  
              })
            })
            

          })
      }
  });
  mongoc.connect('mongodb+srv://root:Adrianecelmaiboss@cluster0-6ijeg.mongodb.net/ascent?retryWrites=true&w=majority', function(err, db){
    io.on('connection', socket =>{
      console.log('wfefgqrgwe')
      socket.on('add-to-cart',(user, parfume) =>{
        console.log('steau e numai unaa /n/n')
        User.addToCart(user, parfume, (res)=>{
          console.log(res)
        },/*cartfull*/ (userdoc, abon)=>{
          socket.emit('cart-msg', `You reached the maximum limit of perfumes (${abon.parfumeChoices}) you can by using your ${abon.name} subscription! You can go to <a href='/scents/subscriptions'>Subscriptions Page</a> and choose another subscription if you'd like.`)
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