var express = require('express');
var router = express.Router();
var csrf = require('csurf'); // Required for login

var csrfProtection = csrf({ cookie: true });

router.get('/', csrfProtection, function(req, res, next) {
  res.render('login', {
    title: 'Iniciar Sesión',
    token: req.csrfToken()
  });
});


module.exports = router;