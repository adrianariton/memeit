var express = require('express');
var router = express.Router();
var User = require('../models/user')
var SecretCode = require('../models/secretcodes')

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user && req.user.status !='verified'){
        SecretCode.sendSecretUrlToUser(req.user._id, req.user.email, req, (err)=>{
            if(err == 'already sent'){
                req.flash('error', `Deja am trimis emailul de verificare userului ${req.user.email}. Așteptați 2 minute ca să îl primiți!`)
                res.redirect('/');
            } else if(err){
                req.flash('error', `Eșuare în trimitera mailului userului ${req.user.email}`)

                res.redirect('/');

            } else {
                req.flash( 'success',  `Am trimis emailul de verificare userului ${req.user.email}. <br> Va lua cam 2 minute ca să îl primiți.`)
                res.redirect('/');


            }

        })
    } else {
        res.redirect('/');

    }
    
});
router.get('/:uid/:secret', function(req, res, next) {
    User.getUserById(req.params.uid, (er,usr)=>{
        
        SecretCode.getEmailCode(usr.email, (err, c)=>{
            if(c){
                if(c.code == req.params.secret){
                    User.verify(req.params.uid, ()=>{
                        req.flash( 'success',  `Verificare completă`)
                        res.redirect('/');
                        //console.log('AAAAAA')
                    })
    
                } else {
                    req.flash( 'error',  `Verificare eșuată`)
                    res.redirect('/');
                    //console.log('ERRVF')
                }
            } else {
                req.flash('error', `Verificare eșuată.`)
                //console.log('ERR')
 
                res.redirect('/');
            }
            
        })
    })
    
});
module.exports = router;