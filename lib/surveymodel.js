var firebase = require('firebase');
var _ = require('lodash');

// var config = {
//     apiKey: "AIzaSyAT7spVMFGob7q6Q1UJCaMi6RvGoMBgcAc",
//     authDomain: "prototipo1-8e37a.firebaseapp.com",
//     databaseURL: "https://prototipo1-8e37a.firebaseio.com",
//     projectId: "prototipo1-8e37a",
//     storageBucket: "prototipo1-8e37a.appspot.com",
//     messagingSenderId: "856846236373"
// };

// Firefighter
// var config = {
//     apiKey: "AIzaSyAhDYV5B4WnGz1S-ewBWNiow-cWB85T3-I",
//     authDomain: "prototipo2-5af1f.firebaseapp.com",
//     databaseURL: "https://prototipo2-5af1f.firebaseio.com",
//     projectId: "prototipo2-5af1f",
//     storageBucket: "prototipo2-5af1f.appspot.com",
//     messagingSenderId: "428785972383"
//   };

// Prot4
var config = {
    apiKey: "AIzaSyALs0CPCUtF8Qz0nZLKm-lGIIRjqVaGYJU",
    authDomain: "prototipo4-57544.firebaseapp.com",
    databaseURL: "https://prototipo4-57544.firebaseio.com",
    projectId: "prototipo4-57544",
    storageBucket: "prototipo4-57544.appspot.com",
    messagingSenderId: "889527900945"
};

// for development
// var config = {
//   apiKey: "AIzaSyDI_Hux_iKuQ5713OuF2tseod0lNxmP-Og",
//   authDomain: "prot1-5db64.firebaseapp.com",
//   databaseURL: "https://prot1-5db64.firebaseio.com",
//   projectId: "prot1-5db64",
//   storageBucket: "prot1-5db64.appspot.com",
//   messagingSenderId: "711884414318"
// };

firebase.initializeApp(config);

let db = firebase.database();
const ENCUESTAS = 'Encuestas';
const EMPRESAS = 'Cuenta';

function getAllSurveys(){
    let survey_ref = db.ref(ENCUESTAS).orderByChild('clasificacion');
    return survey_ref.once('value').then( function(snapshot) {
        let map = mapInfo(snapshot.val());
        return map || null;
    });
}

function mapInfo( data ){
    let mappedinfo = [];
    let uniqueCompanies = [];
    let count = 0;
    for (const el in data) {
        let quest = data[el].cuestionario;
        let raw = {
            uid: el,
            name: data[el].clasificacion,
            company_id: data[el].empresa,
            no: easyCount(quest)
        }
        mappedinfo.push(raw)
        count++;
    }
    return mappedinfo;
}

function easyCount(quest){
    let count = 0; 
    quest.forEach(element => { 
        if(element.tipo == "pregunta") 
            count++;
        })
    return count;
}

function getAllCompanies(){
    let company_ref = db.ref(EMPRESAS).orderByChild('tipo').equalTo('GCP');
    return company_promise = company_ref.once('value').then( function(snapshot){
        return snapshot.val();
    })
}


// Post process.
function surveyKeyExists(key){
    let survey_ref = db.ref(ENCUESTAS + '/' + key); 
    return survey_ref.once('value').then( function(snapshot) {
        return snapshot.val() || null;
    }); 
}

function removeAsign(key){
    let survey_ref = db.ref(ENCUESTAS + '/' + key); 
    let updates = {};
    updates['/empresa' ] = '';
    return survey_ref.update(updates)
        .then( function( snapshot ) {
            console.log("Se actualizó correctamente")
            return;
        })
        .catch( function(err) {
            console.log("Hubo un error" + err);
        });
}



// var test1 = getAllSurveys();
// var test2 = getAllCompanies();
// var test2_1 = keyExists('-L1Vu8WMDnLQyzsxJHhA---x');

// Promise.all([ test1, test2 ]).then(function(data) {
//     let surveyMap = data[0];
//     let companies = data[1];
//     surveyMap.forEach(element => {
//         if( element.company_id in companies ){
//             element.company = companies[element.company_id].NComercial;
//         }
//         else{
//             element.company = '';
//         }
//     });
//     console.log(surveyMap);
// });

// Promise.all([ test2_1 ]).then(function(data) {
//     console.log(data[0]);
//     if( data[0] != null ){
//         console.log("Existe");
//         var test2 = removeAsign('-L1Vu8WMDnLQyzsxJHhA---x');
//         test2.then(function(){
//             console.log("Se actualizó.")
//         });
//     }
//     else{
//         console.log("No existe por lo tanto no puede ser ejecutado.");
//     }
// });


module.exports = {
    getAllSurveys,
    getAllCompanies
};