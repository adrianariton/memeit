var express = require('express');
var router = express.Router();
var Meme = require('../models/meme');

var multer = require('multer');
var upload = multer({dest:'./uploads'})
var User = require('../models/user')
/* GET home page. */
router.get('/', function(req, res, next) {
    Meme.getAll((err, found) => {
        if(err)
            throw err;
            res.render('memes', {memes: found});

    })
});
router.get('/:memeid', function(req, res, next) {
    if(req.user){
        Meme.getMemeById(req.params.memeid, (err, mymeme) => {
            console.log("GET");
            res.render('meme', {meme: mymeme});
            
        })
            
    } else {
        res.redirect('/')
    }
});


router.post('/d/:memeid', function(req, res, next) {
    if(req.user){
        Meme.deleteOne({_id: req.params.memeid}, () => {
            console.log("DELET");

            res.redirect('/memes');
        })
            
    } else {
        res.redirect('/')
    }
});
router.post('/', upload.single('memeimage'), function(req, res, next) {
    if(req.user){
        var memeimage = req.file.path;
        var memetitle= req.body.title;
        var desc = req.body.desc;

        var newMeme = new Meme({
            title: memetitle,
            image: memeimage,
            userID: req.user._id,
            desc: desc
        })

        newMeme.save((err) => {
            res.redirect('/memes')
        })
            
    } else {
        res.redirect('/')
    }
});
module.exports = router;
