'use strict';

var navbar = new Vue({
  el: '#user-display',
  data:{
    user: {
      email: "Esperando...",
      foto: "/images/loader.gif",
      ref: ''
    },
    company: {
      ncomercial: "Esperando...",
      logo: "/images/loader.gif",
      ref: ''
    }
  }
})

$('#psc-signout').click(function( event ){
  event.preventDefault();
  auth.signOut();
  window.location.href='/login';
});

auth.onAuthStateChanged( function( user ){
  if ( !user ) {
    auth.signOut();
    window.location.href='/login';
  }
  var refuser = '/Usuarios/';
  var refcompany = '/Cuenta/';

  firebase.database().ref( refuser + user.uid ).once('value').then(function(snapshot) {
    var e   = snapshot.val().email;
    var f   = snapshot.val().Foto;
    var c   = snapshot.val().Empresa;
    firebase.database().ref( refcompany + c ).once('value').then(function(snapshot) {
      var cn  = snapshot.val().NComercial;
      var cf  = snapshot.val().Logotipo;
      navbar.user.email = e;
      navbar.user.foto = f;
      navbar.company.ncomercial = cn;
      navbar.company.logo = cf;
      // Save reference
      navbar.user.ref = user.uid;
      navbar.company.ref = snapshot.key;
    })
    .catch( function( e ){
      console.log( e );
      crearAlerta('No pude obtener la información de la compania');
    });
  })
  .catch( function( e ){
    crearAlerta('No pude obtener la información del usuario');
  });
});
