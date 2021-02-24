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
  User.getUserById(id, (err, user)=>{
    done(err, user)
  })
})
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done)=>{
  console.log('/PROFILE')
  
  console.log(profile)
    console.log('/PROFILE')
    return done(null, profile)
}))
router.get('/', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/callback', passport.authenticate('google', {
  failureRedirect:'/users/login',
  failureFlash: 'Invalid username or password'
}
), (req,res)=>{
  console.log('\n\n\nREQRES\n\n\n\n\n')
  console.log(req, res)
  req.flash('success', 'You are loggedin')
  res.location('/')

  res.redirect('/')
  })
module.exports = router
 