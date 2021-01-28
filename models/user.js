var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Parfumes = require('../models/parfumes')
//var crypto = require("crypto");
//var algorithm = "aes-192-cbc"; //algorithm to use
//var password = process.env.CRYPTO_PASS;
//const key = crypto.scryptSync(password, 'salt', 24); //create key

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
    },
    addresses: {
        type: [String],
        default: []
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

module.exports.addAddress = function(req, callback){
    var street = req.body.street;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var county = req.body.county;
    var country = req.body.country;

    var address = {
        street: street,
        city: city,
        state: state,
        zip: zip,
        county: county,
        country: country
    }

    var addressStr = JSON.stringify(address);

    console.log(addressStr)

    User.updateOne({username: req.user.username}, {
        $addToSet: {addresses: addressStr}
    }).then(callback)

}
module.exports.removeAddress = function(req, callback){
    var addressStr = req.body.toremove;
    console.log('body')
    console.log(req.body)
    console.log(addressStr)
    User.updateOne({username: req.user.username}, {
        $pull: {addresses: {$in: [ addressStr, addressStr ]}}
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

module.exports.changePwd = function(req, callback){
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(req.body.password, salt, (err, hash)=>{
            User.updateOne({username: req.user.username}, {
                $set: {password: hash}
            }).then(callback)
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

