var express = require('express');
var router = express.Router();
var Parfumes = require('../models/parfumes')
var Abonaments = require('../models/abonaments')
var Subscriptions = require('../models/subscriptions')
var Orders = require('../models/orders');

var User = require('../models/user')
/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user){
        Subscriptions.find({userID: req.user._id}, (err, subs)=>{
            Abonaments.find({}, (err, abons)=>{
                res.render('myaccount', { title: 'My Account',abons: abons, subs: subs });

            })

        })

    } else {
        res.redirect('/')
    }
});
router.get('/orders', function(req, res, next) {
    if(req.user){

        Orders.find({userID: req.user._id}, (err, orders)=>{
            res.render('orders', { title: 'My Orders' , orders: orders});

        })

    } else {
        res.redirect('/')
    }
});
module.exports = router;
