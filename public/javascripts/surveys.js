auth.onAuthStateChanged( function( user ){
  if ( !user ) {
    auth.signOut();
    // window.location.href='/login';
  }
});
