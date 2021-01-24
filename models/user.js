var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Parfumes = require('../models/parfumes')

mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    vorname: {
        type: String
    },
    birthdate:{
        type: String
    },
    profileimage: {
        type: String
    },
    cart: {
        type: [String]
    },
    status: {
        type: String,
        default: "pending",
    },
    marketprocessing: {
        type: Boolean
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
})

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}
module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback)
}
module.exports.getUserByEmail = function(email, callback){
    var query = {email: email};
    User.findOne(query, callback)
}

module.exports.changeEmail = function(username, newmail, callback){
    User.updateOne({username: username}, {
        $set: {email: newmail, status: 'pending'}
    }).then(callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, ismatch){
      callback(null, ismatch)
  })  
}

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            newUser.password=hash;
            newUser.save(callback)

        })
    })
}

module.exports.addToCart = function(username, parfume, callback){
    console.log(parfume)

    User.update({username: username}, { $addToSet: { cart: parfume } }).then(res =>{
        callback(res, parfume)
    })
    //{ $addToSet: { colors: "c" } }
}

module.exports.removeFromCart = function(username, parfume, callback){
    console.log(parfume)
    User.update({username: username}, { $pull: { cart: parfume } },
        { multi: true }).then(res =>{
            console.log(res)
        callback(res)
    })
    //{ $addToSet: { colors: "c" } }
}
module.exports.verify = function(uid, callback){
    User.update({_id: uid}, {
        $set: {status: "verified"}
    }).then(callback)
}
module.exports.getCart = function(username, callback){
    User.getUserByUsername(username, (err, user)=>{
        if(err) throw err
        if(user){
            var parfarr = []
            console.log('\n\n\n\n\n\n cart:')
            console.log(user.cart)
            const ids = [];
            user.cart.forEach(id => {
                ids.push(id)
            })
            Parfumes.find({ _id : { $in: ids } },(err2, parfumes)=>{
                if(err2) throw err2
                console.log('\nParfumes: ')
                console.log(parfumes)
                if(parfumes){
                    callback(parfumes)
                } 
            })
            
        }
        
    })
}

