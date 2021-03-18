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
  done(null, user.id);
})

passport.deserializeUser((id, done)=>{
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
  var username = profile.family_name + profile.id
  User.getUserByEmail(profile.email, function(err, user){
    if(err) throw err;
    if(!user) {
      User.createUser(new User({
        username: username,
        email: profile.email,
        name: profile.family_name,
        vorname: profile.given_name,
        status: 'verified',
        userType: 'google',
        googleId: profile.id
      }), (err, user2)=>{
        return done(null, user2)

      })
    } else {
      return done(null, user)

    }
  })
}))
router.get('/', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/callback', passport.authenticate('google', {
  failureRedirect:'/users/login'
}
), (req,res)=>{
   //req.flash('success', 'You are loggedin')
       res.redirect('/scents/loggedinfromcart')
  
  res.redirect('/')
})
module.exports = router
 