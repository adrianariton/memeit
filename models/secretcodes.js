var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Double } = require('mongodb');
var crypto = require("crypto");
var nodemailer = require('nodemailer');
const { db } = require('./parfumes');

mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema

const SecretCodeSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: '5m',
    },
});
 
var SecretCode = module.exports = mongoose.model('SecretCode', SecretCodeSchema);



module.exports.getEmailCode = function(email, callback){
    var query = {email: email};
    SecretCode.findOne(query, callback)
}
module.exports.sendSecretUrlToUser = function(uid, email,req, callback){
    var secretcode = crypto.randomBytes(20).toString('hex')
    var transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_PASS
        }
    });
    
    var mailOptions = {
      from: process.env.EMAIL_NAME,
      to: email,
      subject: `MEMEIT E-mail verification`,
      html: `
        <h2>MEMEIT-Perfumes</h2>
        <span>Trebuie sa fii logat pentru a deschide linkul!</span>
        <a href='${req.protocol+"://"+req.headers.host}/verify/${uid}/${secretcode}'>Verificati-va adresa!</a>`
      
    };
    var dbcodeobj = new SecretCode({
        email: email,
        code: secretcode
    })
    SecretCode.findOne({email: email}, (err2,sc)=>{
      console.log('doccccccc\n\n\n\n')
      console.log(sc)
      if(sc == null){
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            callback(error)
          } else {
            console.log('Email sent: ' + info.response);
            dbcodeobj.save(callback)
          }
        });
      } else {
        console.log('/n/already sent <3 /n/n')
        callback('already sent')
      }
    })
    
}