var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'})
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}
var User = require('../models/user')

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/users/login')
  }
  
  function ensureNotAuthenticated(req, res, next){
    if(!req.isAuthenticated()){
      return next();
    }
    res.redirect('/')
  }
  
passport.serializeUser((user, done)=>{
  console.log('\n\n\n\n\n USER DESERIALIZE')
  console.log(user)
  console.log('\n\n\n\nUSER^^\n\n\n')
  done(null, user.id);
})

passport.deserializeUser((id, done)=>{
  console.log('\n\n\n\n\n\n IDd ')
  console.log(id)
  console.log('\n\n\n\n\n\n\n')
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    User.getUserById(id, (err, user)=>{
      done(err, user)
    })
  }
  
})
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done)=>{
  console.log('/PROFILE')
  var username = profile.family_name + profile.id
  console.log(username)
  User.getUserByEmail(profile.email, function(err, user){
    console.log(username)
    console.log(user)
    if(err) throw err;
    if(!user) {
      console.log(profile.email)
      User.createUser(new User({
        username: username,
        email: profile.email,
        name: profile.family_name,
        vorname: profile.given_name,
        status: 'verified',
        userType: 'google',
        googleId: profile.id
      }), (err, user2)=>{
        console.log(err,user2)
        return done(null, user2)

      })
    } else {
      return done(null, user)

    }
  })
  console.log(profile)
    console.log('/PROFILE')
}))
router.get('/', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/callback', passport.authenticate('google', {
  failureRedirect:'/users/login',
  failureFlash: 'Invalid username or password'
}, (req,res)=>{
  console.log(req, res)
  res.redirect('/')
  }
))
module.exports = router
 