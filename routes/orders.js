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
        res.redirect('/myaccount/orders')

    } else {
        res.redirect('/')
    }
});
router.get('/:orderid', function(req, res, next) {
    if(req.user){
        Orders.findOne({_id: req.params.orderid}, (err, order)=>{
            if(order){
                if(`"${req.user._id}"`==`"${order.userID}"`){
                    var productsids = []
                    var subscriptionids = []
                    order.products.forEach(product=>{
                        productsids.push(product.id)
                    })
                    if(order.subscriptionsId){
                        order.subscriptionsId.forEach(sub=>{
                            subscriptionids.push(sub)
                        })
                    }
                        
                    Parfumes.find({}, (err, orderedproducts)=>{
                        Subscriptions.find({_id: {$in: subscriptionids}}, (err2, orderedsubs)=>{
                            Abonaments.find({}, (err3, abons)=>{
                                res.render('orderid', { title: 'Cre8' , productArr: orderedproducts, subsArr: orderedsubs, abons: abons, order: order});
        
                            })
                        })
                    })
        
                } else {
                    req.flash('error', `Nu aveți permisiune să vedeți informațiile din comandă!`)
                    res.redirect('/myaccount')
                }
            } else {
                req.flash('error', `Nu există comandă cu acest ID!`)
                res.redirect('/myaccount')
            }
            
            
        })
    } else {
        res.redirect('/')
    }
});
module.exports = router;
