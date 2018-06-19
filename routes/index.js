var express = require('express');
var router = express.Router();

// When I got something must load here. 
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Soporte' });
  res.redirect('/wizard');
});

module.exports = router;
