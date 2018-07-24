var express = require('express');
var router = express.Router();
var dataP = require('../lib/dataconverter'); // Needed for the file parse
var multer = require('multer'); // Recieve files


router.get('/', function(req, res, next){
    res.redirect('/wizard/app')
    // res.render('wizard', { title: 'Wizard' });
    // res.render('surveys', {
    //     title: 'Encuestas'
    // });
});

router.get('/app', function(req, res, next) {
    res.render('wizard', { title: 'Wizard' });
  });
  
var upload = multer({ storage: multer.memoryStorage({}), limits: {fileSize: 1000000 } });

router.post('/app', upload.single('survey_template'), function(req, res, next) {

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