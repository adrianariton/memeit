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
    createdAt: { type: Date, expires: 2628000000, default: Date.now },
    parfumes: {
        type: []
    },
    status:{ //not delivered/ delivered/ canceled
        type: String,
        default:'ordered'
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
    Subscriptions.findOne({userID: newP.userID, status: 'ordered'} , (err, doc)=>{
        console.log('DOOOOOOC SUB')
        console.log(err,doc)
        console.log('DOOOON')
        if(doc){
            callback('Duplicate', null)


        } else {
            newP.save(callback)

        }
    })
}
module.exports.cancelSubscription = function(id, callback){
    Subscriptions.updateOne({_id: id}, {
        $set: {status: 'canceled'}
    }).then((err, res)=>{
        callback(err,res)
    })
}