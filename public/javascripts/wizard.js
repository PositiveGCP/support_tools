$('#wizard-send').click(function (evt){
  evt.preventDefault();
  let survey_template = $('#wizard-input-file')[0];
  if( survey_template.files.length == 0 ){
    var $toastContent = $('<span>No has subido archivos aún.</span>').add($('<button class="btn-flat toast-action" onclick="OKremove()">OK</button>'));
    Materialize.toast($toastContent, 3000);
  }
  else{
    let data = createData();
    $.ajax({
      url: '/wizard',
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
      console.log(data);
    });
  }
});

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
