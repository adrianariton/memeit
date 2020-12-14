var express = require('express');
var router = express.Router();
var Parfumes = require('../models/parfumes')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('scents', { input: 'none'});
});

router.get('/:query', function(req, res, next) {
    /* retrieve queryed elems */
    if(req.params.query == 'men'){
      var men;
      Parfumes.getMen((err, data)=>{
        men = data
        console.log('MEEEEN')
      console.log(JSON.stringify(men))
      res.render('scents', { input: req.params.query, title: 'Men', scents: men});

      })
      
      
    } else if(req.params.query == 'women'){
      var women;
      Parfumes.getWomen((err, data)=>{
        women = data
        res.render('scents', { input: req.params.query, title: 'Women', scents: women});

      })
      
    }
});

module.exports = router;