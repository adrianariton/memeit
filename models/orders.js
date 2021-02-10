var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Double } = require('mongodb');
const { ObjectID } = require('mongodb');
     
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
    status: {   //delivered / pending / returned / failed
        type: String
    },
    products: {
        type: Object
    },
    deliverymethod: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    subscriptionsId: {
        type: [],
        default: []
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