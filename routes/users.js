var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'})
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');

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
    //req.flash('success', 'You are loggedin')
    if(req.body.redirect == '/scents/cart'){
      res.redirect('/scents/loggedinfromcart')
    }
    res.redirect('/')
  }
)



passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},function(username,password,done){
  User.getUserByUsername(username, function(err, user){
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
   // console.log('uploading file...')
    var profileimage = req.file.filename;
  } else {
   // console.log('no file uploaded...')
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
            })
            req.flash('success', 'Ați fost înregistrat și vă puteți autentifica!')
            res.location('/memes')
        res.redirect('/memes')
          } else {
            req.flash('error', 'Emailul este deja folosit!')
            res.location('/users/register')
            res.redirect('/users/register')
          }
        })
        

        
      } else {
        req.flash('error', 'Username-ul este deja folosit!')
        res.location('/users/register')
        res.redirect('/users/register')
      }
    })

   
   
  }

});

router.post('/myaccount',upload.single('profileimage') , function(req, res, next){
  if(req.user){
    if(req.body.email){
      req.checkBody('email', 'Câmpul Emailului trebuie completat!').notEmpty();
      req.checkBody('email', 'Emailul nu e valid!').isEmail();

      var errors = req.validationErrors();

      if(errors) {
        res.render('myaccount', {
          errors: errors
        })
      } else {
        User.changeEmail(req.user.username,req.body.email,req, (result, err)=>{
          if(err){
            req.flash('error', 'Ceva a mers rău!')
            res.redirect('/myaccount')

          } else {
            req.flash('success', 'V-ați schimbat adresa de Email cu succes! Trebuie să vă reverificați contul!')
            res.redirect('/myaccount')
          }
          
        })
      }

      
    } else {
      if(req.body){
        req.checkBody('street', 'Street field cannot be empty!').notEmpty();
        req.checkBody('city', 'City field cannot be empty!').notEmpty();
        req.checkBody('zip', 'Zip field cannot be empty!').notEmpty();
        req.checkBody('country', 'Country field is required!').notEmpty();

        var errors = req.validationErrors();

        if(errors) {
          req.flash('error', errors)
          res.redirect('/myaccount')
        } else {
          User.addAddress(req, (result, err)=>{
            if(req.body.fromcart){
              if(err){
                res.json({error: true, message:'Ceva a mers rău!'})

              } else {
                res.json({error: false, message:'Adresa a fost adăugată cu succes!', address: req.body})

              }
            } else {
              if(err){
                req.flash('error', 'Ceva a mers rău!')
                res.redirect(req.get('referer'));
    
              } else {
                req.flash('success', 'Address added!')
                res.redirect(req.get('referer'));
  
              }
            }
          })
        }

      } else {
        req.flash('error', 'Ceva a mers rău!')
        res.redirect('/myaccount')
      }
    }
    
  } else {
    res.redirect('/memes')
  }
})

router.post('/removeaddress',upload.single('profileimage') , function(req, res, next){
  if(req.user){
    
    User.removeAddress(req, (result, err)=>{
      if(err){
        req.flash('error', 'Ceva a mers rău!')
        res.redirect('/myaccount')

      } else {
        req.flash('success', 'A fost ștearsă adresa!')
        res.redirect('/myaccount')
      }
      
    })
    

    
  } else {
    res.redirect('/memes')

  }
})
router.post('/password',upload.single('profileimage') , function(req, res, next){
  if(req.user){
    
    User.changePwd(req, (result, err)=>{
      if(err){
        req.flash('error', 'Parola nu a putut fi schimbată!')
        res.redirect('/myaccount')

      } else {
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
          to: req.user.email,
          subject: `MEMEIT E-mail verification`,
          text: `Your password for: ${req.protocol+"://"+req.headers.host} has been changed!`
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.redirect('/myaccount')
          } else {
            req.flash('success', 'Password changed!')
            res.redirect('/myaccount')
          }
        });
        
      }
      
    })
    

    
  } else {
    res.redirect('/memes')

  }
})
router.get('/logout', function(req, res){
  req.logOut();
  //req.flash('success', 'You are now logged out');
  res.redirect('/users/login')
})
module.exports = router;
