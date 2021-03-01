var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Double, connect } = require('mongodb');
const { ObjectID } = require('mongodb');
var Subscriptions = require('../models/subscriptions')
 
mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema

var OrdersSchema = mongoose.Schema({
    amount: {
        type: Number
    },
    currency: {
        type: String,
        default: 'lei'
    },
    email: {
        type: String
    },
    userID: {
        type: ObjectID
    },
    shipping: {
        type: Object
    },
    status: {   //delivered / ordered/ failed / canceled
        type: String,
        default: 'ordered'
    },
    products: {
        type: Object
    },
    deliverymethod: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    subscriptionsId: {
        type: [],
        default: []
    },
    date: {
        type: Date,
        default: Date.now()
    },
    discountPercentage: {
        type: Number,
        default: 0
    }
})

var Orders = module.exports = mongoose.model('Orders', OrdersSchema);


module.exports.getOrdersByUID = function(id, callback){
    var query = {userID: id};
    Orders.find(query, callback)
}

module.exports.create = function(newP, callback){
    newP.save(callback)
}

module.exports.cancelOrder = function(id, callback){
    Orders.updateOne({_id: id}, {
        $set: {status: 'canceled'}
    }).then((err, res)=>{
        Orders.findById(id, (err, order)=>{
            order.subscriptionsId.forEach(element => {
                Subscriptions.cancelSubscription(element, (errsub, result)=>{
                    console.log(errsub, result)
                })
            });
            callback()
        })
    })
    
}