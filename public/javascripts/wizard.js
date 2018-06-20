$(document).ready(function() {

  let queryCuentas = db.ref('Cuenta').orderByChild('tipo').equalTo('GCP');

  queryCuentas.once('value').then(function(snapshot) {
    let raw_accounts = snapshot.val();
    for (var element in raw_accounts) {
      let value = element;
      let name = raw_accounts[element].NComercial;
      let new_opt = $("<option>").attr("value", value).text(name)
      $("#company").append(new_opt);
    }
    $('select').material_select();
  });

});

auth.onAuthStateChanged( function( user ){
  if ( !user ) {
    auth.signOut();
    window.location.href='/login';
  }
  wizard_app.survey.uploaded_by = user.uid;
});

function makeRequest() {
  let survey_template = $('#wizard-input-file')[0];
  if( survey_template.files.length == 0 ){
    var $toastContent = $('<span>No has subido archivos aún.</span>').add($('<button class="btn-flat toast-action" onclick="OKremove()">OK</button>'));
    Materialize.toast($toastContent, 3000);
  }
  else{
    let data = createData();
    $.ajax({
      url: '/wizard/app',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      success: function(data){
        var $toastContent = $('<span>Subido</span>').add($('<button class="btn-flat toast-action" onclick="OKremove()">OK</button>'));
        Materialize.toast($toastContent, 3000);
      }
    })
    .done(function( data ) {
      var $toastContent = $('<span>Recibido</span>').add($('<button class="btn-flat toast-action" onclick="OKremove()">OK</button>'));
      Materialize.toast($toastContent, 3000, 'green');
      // TODO: validations when is error.
      wizard_app.survey.cuestionario = data.payload;
    });
  }
}

function createData(){
  let data = new FormData();
  let file = $('#wizard-input-file')[0].files[0];
  data.append('survey_template', file);
  return data;
}


function OKremove(){
  var toastElement = $('.toast').first()[0];
  var toastInstance = toastElement.M_Toast;
  toastInstance.remove();
}

var wizard_app = new Vue({
  el: '#wizard-app',
  data: {
    survey: {
      clasificacion: '',
      cuestionario: null,
      empresa: '',
      type: '',
      allowed_list: null,
      uploaded_by: ''
    },
    empresa:{
      nombre: '',
      key: ''
    },
    survey_key: ''
  },
  computed: {
    surveyAnalysis: function () {
      // Do things with cuestionario
      let resume = {
        count: 0,
        survey: null
      };
      let count = 0;
      if (this.survey.cuestionario != null) {
        let quest = this.survey.cuestionario;
        for (var i in quest) {
          if ( quest[i].tipo == "pregunta" ) {
            count++;
          }
        }
        resume.survey = getStructData(quest);
        resume.count = count;
        return resume;
      }
      return 0;
    },
    isReady: function functionName() {
      if (this.survey.clasificacion.length != 0 && this.survey.empresa.length != 0 && this.survey.type.length != 0 && this.survey.cuestionario != null) {
        return true;
      }
      return false;
    }
  },
  methods: {
    getJSONSurvey: function (event) {
      event.preventDefault();
      makeRequest();
    },
    upload: function (evt) {
      evt.preventDefault();
      let survey_branch = "Encuestas"
      let clasificacion = this.survey.clasificacion;
      if ( clasificacion.length == 0 ) {
        var $toastContent = $('<span>Aún no completas los campos.</span>').add($('<button class="btn-flat toast-action" onclick="OKremove()">OK</button>'));
        Materialize.toast($toastContent, 3000);
        return 0;
      }
      var newSurveyKey = db.ref(survey_branch).push().key;
      this.survey_key = newSurveyKey;
      var update = {};
      update['/' + survey_branch + '/' + newSurveyKey] = this.survey;
      firebase.database().ref().update(update)
        .then(function(){
          var $toastContent = $('<span>Subida: ' + newSurveyKey + '</span>').add($('<button class="btn-flat toast-action">OK</button>'));
          Materialize.toast($toastContent, 3000);
          clean();
        }).catch(function(error) {
          console.error(error);
        });
    }
  },
  filters: {
    short: function(value){
      if ( value.length > 20 ) {
        return value.slice(0, 40);
      }
    }
  }
});

function clean(){
  $('#clasificacion').val("");
  $('select').prop('selectedIndex', 0);
  $('select').material_select();
  $('.file-path').val("");
  $('#wizard-input-file')[0] = null;
  wizard_app.survey.clasificacion = '';
  wizard_app.survey.cuestionario = null;
  wizard_app.survey.empresa = '';
  wizard_app.survey.type = '';
  wizard_app.survey.allowed_list = null;
  wizard_app.survey.uploaded_by = '';
  wizard_app.empresa.nombre = '';
  wizard_app.empresa.key = '';
}


function getStructData( data ) {
  var structured;

  structured = getTopics(data, getAreas(data));

  for (var i in data) {
    let area = data[i].area;
    let topic = data[i].topic;
    let pregunta = data[i].pregunta;
    let puntaje = data[i].puntaje;
    if ( data[i].tipo == "pregunta" ) {
      structured[area][topic].push({pregunta: pregunta, puntaje: puntaje, pos: i});
    }
  }
  return structured;
}

function getAreas(data){
  var areas = [];
  for (var i in data) {
    areas.push(data[i].area);
  }
  return _.uniq(areas);
}

function getTopics(data, area){
  var dict = {};
  for (var item in area) {
    dict[area[item]] = {}
  }
  for (var i = 0; i < area.length; i++) {
    for (var item in data) {
      if (data[item].area == area[i]) {
        dict[area[i]][data[item].topic] = [];
      }
    }
  }
  return dict;
}


$('#type').on('change', function(e) {
  let type = $('#type').val();
  wizard_app.survey.type = type;
});

$('#company').on('change', function(e) {
  let company_key = $('#company').val();
  let company_name = $('#company option:selected').text();
  wizard_app.empresa.nombre = company_name;
  wizard_app.empresa.key = company_key;
  wizard_app.survey.empresa = company_key;
});
