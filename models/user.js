var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Parfumes = require('../models/parfumes')
//var crypto = require("crypto");
//var algorithm = "aes-192-cbc"; //algorithm to use
//var password = process.env.CRYPTO_PASS;
//const key = crypto.scryptSync(password, 'salt', 24); //create key
var SecretCode = require('../models/secretcodes')
var nodemailer = require('nodemailer');

var Abonaments = require('../models/abonaments')
var Subscriptions = require('../models/subscriptions')
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
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    stripeCustomerID: {
        type: String,
        default: null
    },
    emailAliases:{
        type: [String],
        default: null
    },
    userType: {
        type: String,
        default: 'default'
    },
    googleId: {
        type: String
    }
})

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        User.findOne({_id:id}, callback);

    } else {
        callback(null, null)
    }
}
module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback)
}
module.exports.getUserByEmail = function(email, callback){
    var query = {email: email};
    User.findOne(query, callback)
}
module.exports.sendWelcomeMail = function(user, callback){
    var transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_PASS
        }
    });
    var htm =``
    var mailOptions = {
        from: process.env.EMAIL_NAME,
        to: user.email,
        subject: `Bine ati venit!`,
        html:`

        <div style='width: 100% !important;'>
            

            <div style='width: 100% !important;display:table; flex-direction: column; justify-content: center; align-items: center;'>
            
                <h1 style='display:table-row;'>MEMEIT</h1>
                <h2 style='display:table-row;'>Salut ${user.name}. Bine ai memuit!</h2>
            </div>
            
            <div style='width: 100%;margin-top:5em;display:table; flex-direction:column; justify-content: center; align-items: center;'>
                <h3 style='display:table-row;'>Contul dvs. a fost creat!</h3>
                <span style='display:table-row;'>Username-ul dvs. este ${user.username}</span>
                <h4 style='display:table-row;'>Va rugam sa va verificati contul daca aceasta adresa este intr-adevar a dvs.</h4>
            </div>
        </div>

        `
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          callback(error)
        } else {
          console.log('Email sent: ' + info.response);
            callback(null)
        }
    });
}
module.exports.changeEmail = function(username, newmail,req, callback){
    var reqcopy = req;
    SecretCode.deleteMany({email: reqcopy.user.email}).then(()=>{
        User.updateOne({username: username, userType: {$ne: 'google'}}, {
            $set: {email: newmail, status: 'pending', stripeCustomerID: null},
            $addToSet: {emailAliases: reqcopy.user.email, stripeCustomerIDAliases: reqcopy.user.stripeCustomerID}
        }).then(callback).catch(eror=>{
            if(eror)
            callback(null,eror)
        })
    })
    
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, ismatch){
      callback(null, ismatch)
  })  
}

module.exports.createUser = function(newUser, callback){
    if(newUser.password && newUser.type != 'google'){
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                newUser.password=hash;
                newUser.save((err2, usr)=>{
                    if(err2){
                        console.log('EROOR')
                        console.log(err2)
                        callback(err2, usr)
                    }else {
                        User.sendWelcomeMail(usr, (errorm)=>{
                            console.log('EMAIL SENT WELCOME')
                            console.log(errorm)
                            callback(err2, usr)
                        })

                    }
                })
    
            })
        })
    } else {
        newUser.save((err2, usr)=>{
            if(err2){
                console.log('EROOR')
                console.log(err2)
                callback(err2, usr)
            }else {
                User.sendWelcomeMail(usr, (errorm)=>{
                    console.log('EMAIL SENT WELCOME')
                    console.log(errorm)
                    callback(err2, usr)
                })

            }
        })

    
    }
   
}

module.exports.changePwd = function(req, callback){
    if(req.user.type != 'google'){
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(req.body.password, salt, (err, hash)=>{
                User.updateOne({username: req.user.username}, {
                    $set: {password: hash}
                }).then(callback)
            })
        })
    } else {
        callback()
    }
    
}

 




module.exports.verify = function(uid, callback){
    User.update({_id: uid}, {
        $set: {status: "verified"}
    }).then(callback)
}
 

