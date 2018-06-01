var express = require('express');
var router = express.Router();
var dataP = require('../lib/dataconverter');
var csrf = require('csurf'); // Required for login
var multer = require('multer'); // Recieve files

var csrfProtection = csrf({ cookie: true });

router.get('/login', csrfProtection, function(req, res, next) {
  res.render('login', {
    title: 'Iniciar Sesión',
    token: req.csrfToken()
  });
});


router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Soporte' });
  res.redirect('/wizard');
});

// router.get('/transaction/:transactionID', function(req, res){
//   let transaction = req.params.transactionID;
//   console.log("Entraste a " + req.params.transactionID);
//   res.render('transaction_details', { title: 'Resultados '+transaction, tID: transaction });
//   // TODO: Create the middleware to check in the database for correc id.
// });

// Wizard Stuff
router.get('/wizard', function(req, res, next) {
  res.render('wizard', { title: 'Wizard' });
});

var upload = multer({ storage: multer.memoryStorage({}), limits: {fileSize: 1000000 } });

router.post('/wizard', upload.single('survey_template'), function(req, res, next) {

  if ( !req.file ) {
    return res.send({
      success: false
    });
  }

  let text = req.file.buffer.toString('utf8');
  let surveyJSON;
  try {
    surveyJSON = dataP( text );
  } catch (e) {
    console.log( e );
    return res.send({
      success: false
    });
  }

  return res.send({
    payload: surveyJSON,
    success: true
  });

});


module.exports = router;
