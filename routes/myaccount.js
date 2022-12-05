var express = require('express');
var router = express.Router();
var Meme =  require('../models/meme');

var User = require('../models/user')
/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user){
        Meme.find({userID: req.user._id}, (err, memes)=>{
            res.render('myaccount', { title: 'My Account', memes: memes }); 

        })

    } else {
        res.redirect('/memes')
    }
});

module.exports = router;
