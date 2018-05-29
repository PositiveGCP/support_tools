var express = require('express');
var router = express.Router();
const multer = require('multer');
var upload = multer({ storage: multer.memoryStorage({}), limits: {fileSize: 1000000 } });
var dataP = require('../lib/dataconverter');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Soporte' });
});

router.get('/transaction/:transactionID', function(req, res){
  let transaction = req.params.transactionID;
  console.log("Entraste a " + req.params.transactionID);
  res.render('transaction_details', { title: 'Resultados '+transaction, tID: transaction });
  // TODO: Create the middleware to check in the database for correc id.
});

// Wizard Stuff
router.get('/wizard', function(req, res, next) {
  res.render('wizard', { title: 'Wizard' });
});

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
