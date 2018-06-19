var express = require('express');
var router = express.Router();

var survey_model = require('../lib/surveymodel');

router.get('/survey/:id', function(req, res, next){
    
    if( !req.params.id ){
        res.json({
            status: 'error',
            msg: 'No id assigned'
        });
    }

    let paramID = req.params.id;
    if ( paramID == "all" ){
        let surveys = survey_model.getAllSurveys();
        let companies = survey_model.getAllCompanies();

        Promise.all([ surveys, companies ]).then(function(data) {
            let surveyMap = data[0];
            let companies = data[1];
            surveyMap.forEach(element => {
                if( element.company_id in companies ){
                    element.company = companies[element.company_id].NComercial;
                }
                else{
                    element.company = '';
                }
            });
            res.json({
                status: 'ok',
                data: surveyMap 
            });
        });
    }


});

module.exports = router;