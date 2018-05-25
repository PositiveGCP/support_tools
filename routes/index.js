var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:transactionID', function(req, res){
  res.render('transaction_details', {tID: transactionID});
  // TODO: Create the middleware to check in the database for correc id.
});


module.exports = router;
