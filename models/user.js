var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
     
mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    },
    cart: {
        type: [String]
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
    User.update({username: username}, { $addToSet: { cart: parfume } }).then(res =>{
        callback(res)
    })
    //{ $addToSet: { colors: "c" } }
}

