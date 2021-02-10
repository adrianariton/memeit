var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Double } = require('mongodb');
const { ObjectID } = require('mongodb');
     
mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema

var SubscriptionsSchema = mongoose.Schema({
    userID:{
        type: ObjectID
    },
    abonamentID:{
        type: ObjectID
    },
    abonamentName:{
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
    parfumes: {
        type: []
    },
    status:{ //not delivered/ delivered/ canceled
        type: String,
        default:'not delivered'
    }
})

var Subscriptions = module.exports = mongoose.model('Subscriptions', SubscriptionsSchema);

module.exports.getSubscriptionById = function(id, callback){
    Subscriptions.findById(id, callback);
}
module.exports.getSubscriptionByName = function(name, callback){
    var query = {name: name};
    Subscriptions.findOne(query, callback)
}
module.exports.getSubscriptionsByUID = function(id, callback){
    var query = {userID: id};
    Subscriptions.find(query, callback)
}
module.exports.create = function(newP, callback){
    newP.save(callback)
}