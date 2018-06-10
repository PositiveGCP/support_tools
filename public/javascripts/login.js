"use strict";

function stringCheck(string, path) {
  var opt = path == true ? path : false;
  var spaces = 0,
    paths = 0,
    empty = 0;
  var regPath = /(\/\w+)+/g;

  var temp = string;

  if (string == "")
    empty = 1;
  if (string.indexOf(' ') >= 0)
    spaces = 1;
  if (temp.match(regPath) != null)
    paths = 1;

  if (opt == false) {
    if (empty == 1)
      return "notString";
    if (spaces == 1)
      return "spaceFormat";
    if (paths == 1)
      return "pathFormat";
  } // if
  else {
    if (empty == 1)
      return "notString";
    if (spaces == 1)
      return "spaceFormat";
  } // else

  return string;
}

function crearAlerta(alert, color) {
  var alerta = $('<span>' + alert + '</span>');
  Materialize.toast(alerta, 3000, color);
}

$('#email-input').keydown(function(e) {
  if (e.which == 13) {
    e.preventDefault();
    e.stopPropagation();
    loginProcess();
  }
});
$('#passwd-input').keydown(function(e) {
  if (e.which == 13) {
    e.preventDefault();
    e.stopPropagation();
    loginProcess();
  }
});
$('#login-request').click(function( e ) {
  e.preventDefault();
  loginProcess();
});

function loginProcess() {
  var param1 = stringCheck($('#email-input').val()),
      param2 = stringCheck($('#passwd-input').val(), true);
  var login = null;
  // Validate mail took from: https://stackoverflow.com/questions/37606285/how-to-validate-email-using-jquery-validate
  var emailexp = new RegExp(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i);
  if ((param1 != $('#email-input').val()) || (param2 != $('#passwd-input').val())) {
    crearAlerta("Hay campos faltantes.", "rounded black");
    $('#email-input').val("");
    $('#passwd-input').val("");
    return;
  } else {
    if ( param1.match(emailexp)) {
      crearAlerta("<strong>Autenticando...</strong>", "rounded blue");
    }
    else{
      crearAlerta('Correo inválido.','rounded red');
      return;
    }
  }

  auth.setPersistence( firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    return auth.signInWithEmailAndPassword(param1, param2)
        .then(function(success) {})
        .catch(function(e) {
          errHandler(e);
        });
  })
  .catch(function(error) {
    crearAlerta('Account persistence problem.', 'red')
  });



}

function errHandler(error) {
  var message = "",
    defaultmsg = "Ocurrió un error, intente de nuevo.";

  var errDict = ["auth/invalid-email",
    "auth/user-disabled",
    "auth/user-not-found",
    "auth/wrong-password",
    "auth/bad-string" // PSC necessary
  ]; // Diccionario de errores

  //Encontrar el error.
  var err = errDict.indexOf(error.code);

  switch (err) {
    case 0:
      message = "Formato de email inválido.";
      break;
    case 1:
      message = "Usuario desabilitado.";
      break;
    case 2, 3:
      message = "El usuario o contraseña es incorrecta.";
      break;
    case 4:
      message = "No es un usuario y/o contraseña válido.";
      break;
    default:
      message = defaultmsg;
      break;
  } //switch
  $('#email-input').val("");
  $('#passwd-input').val("");
  $("#email-input").focus();
  crearAlerta(message, "red");

} //errHandler


/*
 * Detonante cuando la sesión haya cambiado
 */
auth.onAuthStateChanged(function(user) {
  if (user) { // Cuando el usuario se identifico
    NProgress.start();
    let queryUsuario = db.ref('Usuarios/' + user.uid );

    queryUsuario.once('value').then(function(snapshot) {
      let info_user = snapshot.val();
      if (info_user.Tipo == "superuser" || info_user.Tipo == "soporte"){
        window.location.href = '/wizard';
      }
      else{
        $('#email-input').val("");
        $('#passwd-input').val("");
        crearAlerta("Ocurrió un error.", "black");
        auth.signOut();
      }
    });
  }
  return;
});
