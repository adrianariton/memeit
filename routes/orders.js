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
                                console.log(orderedsubs, subscriptionids)
                                res.render('orderid', { title: 'Ascent' , productArr: orderedproducts, subsArr: orderedsubs, abons: abons, order: order});
        
                            })
                        })
                    })
        
                } else {
                    req.flash('error', `You don't have permission to view this order's info!`)
                    res.redirect('/myaccount')
                }
            } else {
                req.flash('error', `There exists no order with this id!`)
                res.redirect('/myaccount')
            }
            
            
        })
    } else {
        res.redirect('/')
    }
});
module.exports = router;