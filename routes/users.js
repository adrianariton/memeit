var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'})

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user')
 /* GET users listing. */
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

router.get('/register',ensureNotAuthenticated, function(req, res, next) {
  res.render('register', {title:'Register'});
  console.log('hi')
});

router.get('/login',ensureNotAuthenticated, function(req, res, next) {
  res.render('login', {title:'Login'});
});
passport.serializeUser((user, done)=>{
  done(null, user.id);
})

passport.deserializeUser((id, done)=>{
  User.getUserById(id, (err, user)=>{
    done(err, user)
  })
})
router.post('/login', 
  passport.authenticate('local',
   {failureRedirect:'/users/login',
    failureFlash: 'Invalid username or password'}),
  function(req, res) {
    //succesfull req.user is the current user
    req.flash('success', 'You are loggedin')
    res.redirect('/')
  }
)



passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},function(username,password,done){
  User.getUserByUsername(username, function(err, user){
    console.log(username)
    console.log(password)
    console.log(user)
    if(err) throw err;
    if(!user) {
      return done(null,false,{
        message: 'Unknown user'
      })
    }

    User.comparePassword(password, user.password, function(err, ismatch){
      if(err) return done(err)
      if(ismatch){
        return done(null, user)
      } else {
        return done(null, false, {message: 'Invalid Password'})
      }
    })
  })
}))

router.post('/register',upload.single('profileimage') , function(req, res, next) {
  var name = req.body.name;
  var vorname = req.body.vorname;
  var birthdate = req.body.birthdate;
  var email = req.body.email;
  var username= req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
 
  if(req.file){
    console.log('uploading file...')
    var profileimage = req.file.filename;
  } else {
    console.log('no file uploaded...')
    var profileimage = 'noimage.jpg';

  }

  // Form Validation

  req.checkBody('name', 'Introduceti numele dvs.').notEmpty();
  req.checkBody('vorname', 'Introduceti prenumele dvs.').notEmpty();
  req.checkBody('birthdate', 'Introduceti data nasterii').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'A password is required').notEmpty();
  req.checkBody('password2', 'Passwords dont match').equals(req.body.password);

  // Check errors

  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors: errors
    })
  } else {
    var newUser = new User({
      name: name,
      vorname: vorname,
      birthdate: birthdate,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    })

    User.getUserByUsername(username, (err, fuser)=>{
      if(err) throw err;
      if(!fuser) {
        User.getUserByEmail(email, (err2, euser)=>{
          if(err2) throw err2;
          if(!euser){
            User.createUser(newUser, (err3, user)=>{
              if(err3) throw err3
              console.log(user)
            })
            req.flash('succes', 'You are now registered and can login')
            res.location('/')
        res.redirect('/')
          } else {
            req.flash('error', 'Email is already in use')
            res.location('/users/register')
            res.redirect('/users/register')
          }
        })
        

        
      } else {
        req.flash('error', 'Username exists')
        res.location('/users/register')
        res.redirect('/users/register')
      }
    })

   
   
  }

});

router.get('/logout', function(req, res){
  req.logOut();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login')
})
module.exports = router;
