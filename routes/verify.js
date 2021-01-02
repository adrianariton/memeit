var express = require('express');
var router = express.Router();
var User = require('../models/user')
var SecretCode = require('../models/secretcodes')

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user){
        SecretCode.sendSecretUrlToUser(req.user._id, req.user.email, req, (err)=>{
            console.log('HEYO')
            if(err){
                req.flash('error', `Failed to send verification mail to ${req.user.email}`)

                res.redirect('/');

            } else {
                req.flash( 'success',  `Sent verification mail to ${req.user.email}`)
                res.redirect('/');


            }

        })
    } else {
        res.redirect('/');

    }
    
});
router.get('/:uid/:secret', function(req, res, next) {
    console.log(req.user._id, req.params.uid)
    if(req.user && req.user._id == req.params.uid && req.user.status !='verified'){
        SecretCode.getEmailCode(req.user.email, (err, c)=>{
            if(c){
                if(c.code == req.params.secret){
                    User.verify(req.user._id, ()=>{
                        req.flash( 'success',  `Verification complete!`)
                        res.redirect('/');
                        //console.log('AAAAAA')
                    })
    
                } else {
                    req.flash( 'error',  `Verification failed!`)
                    res.redirect('/');
                    //console.log('ERRVF')
                }
            } else {
                req.flash('error', `Failed verification.`)
                //console.log('ERR')

                res.redirect('/');
            }
            
        })
    } else {
        console.log('MUIE STAEUA')
        res.redirect('/');

    }
    
});
module.exports = router;