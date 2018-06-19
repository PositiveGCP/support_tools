var express = require('express');
var router = express.Router();
var dataP = require('../lib/dataconverter'); // Needed for the file parse
var csrf = require('csurf'); // Required for login
var multer = require('multer'); // Recieve files

// When I got something must load here. 
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Soporte' });
  res.redirect('/wizard');
});

module.exports = router;
