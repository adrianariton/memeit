var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user){
        res.render('myaccount', { title: 'My Account' });

    } else {
        res.redirect('/')
    }
});
router.get('/orders', function(req, res, next) {
    if(req.user){
        res.render('orders', { title: 'My Orders' });
    } else {
        res.redirect('/')
    }
});
module.exports = router;
