auth.onAuthStateChanged( function( user ){
  if ( !user ) {
    auth.signOut();
    // window.location.href='/login';
  }
});

$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});

Vue.component('datatable', {
  data: function(){
    return {
      checked: null,
      offset: 0
    }
  },
  props: ['data', 'headers', 'total_records'],
  template: 
  `
  <table class="highlight datatable"> 
    <col width="10%"> 
    <col width="10%">
    <col width="10%">
    <col width="45%">
    <col width="15%">
    <col width="10%">

    <thead>
      <tr>
        <th v-for="header in headers"> {{ header | caps }} </th>
        <th> </th>
        <th> </th>
      </tr>
    </thead>

    <tfoot>
      <tr>
        <td colspan="100"> Mostrando un total de {{ getTotalSurveys }} cuestionarios.</td>
      </tr>
    </tfoot>

    <tbody> 
      <tr v-for="element in data"> 
        <td> {{ element.uid }} </td>
        <td> {{ element.date }} </td>
        <td> {{ element.company }} </td>
        <td> {{ element.name }} </td>
        <td> {{ element.no }} </td>
        <td>
          <a class='btn z-depth-0 pbb' @click="openModal(element)" href='#'>Acciones</a>
        </td>
      </tr>
    </tbody>
  </table>
  `,
  computed: {
    getTotalSurveys: function(){
      let cache = this.data;
      let keys = Object.keys(cache);
      return keys.length;
    }
  },
  methods: {
    checkedChange: function(){
      // TODO: Do something
      console.log(this.checked);
    },
    openModal: function( info ){
      surveyApp.one = info;
      $('#modal_actions').modal('open');
    }
  },
  filters: {
    caps: function(text){
      return text.toUpperCase();
    },
  }
});

var exampleData = {
  headers: ['ID', 'empresa', 'fecha', 'clasificacion', 'No. preguntas'],
  data: {
    0: {
      uid: 'ID0',
      date: 'FECHA0',
      company: 'EMPRESA0',
      company_id: 'ID',
      name: 'Bla bla bla de cumplimiento',
      no: 10,
      raw: null
    },
    1: {
      uid: 'ID1',
      date: 'FECHA1',
      company: 'EMPRESA1',
      company_id: 'ID',
      name: 'Bla bla bla de cumplimiento',
      no: 10,
      raw: null
    }
  }
   
};

var surveyApp = new Vue({
  el: '#surveys',
  data: {
    sample: exampleData,
    one: {
      name: ''
    }
  }
});