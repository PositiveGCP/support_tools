auth.onAuthStateChanged( function( user ){
  if ( !user ) {
    auth.signOut();
    // window.location.href='/login';
  }
});

$(document).ready(function(){
  $.get("/api/survey/all", function(data, status){
    // console.log(data)
    surveyApp.sample.data = data.data;
  });
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
    <col width="20%">
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
      <tr colspan="100" v-if="data == undefined"> Procesando... </tr>
      <tr v-for="element in data"> 
        <td> {{ element.uid }} </td>
        <td> {{ element.company | checkNotAsigned }} </td>
        <td> {{ element.name }} </td>
        <td> {{ element.no }} </td>
        <td>
          <a class='btn z-depth-0 pbb' :id="element.uid" @click="removeQuest(element.uid)" href='#'>
            <i class="material-icons"> delete_forever </i>
            QUITAR
          </a>
        </td>
      </tr>
    </tbody>
  </table>
  `,
  computed: {
    getTotalSurveys: function(){
      if( this.data ){
        let cache = this.data;
        let keys = Object.keys(cache);
        return keys.length;      
      }
      else{
        return 0;
      }
    }
  },
  methods: {
    checkedChange: function(){
      // TODO: Do something
      console.log(this.checked);
    },
    removeQuest: function( id ){
      // TODO: Magic comes here.
      console.log("Se va a remover: " + id);
    }
  },
  filters: {
    checkNotAsigned: function(text){
      if(text == "")
        return "No asignada";
      return text;
    },
    caps: function(text){
      return text.toUpperCase();
    },
  }
});

// var exampleData = {
//   headers: ['ID', 'empresa', 'clasificacion', 'No. preguntas'],
//   data: {
//     0: {
//       uid: 'ID0',
//       date: 'FECHA0',
//       company: '',
//       company_id: 'ID',
//       name: 'Bla bla bla de cumplimiento',
//       no: 10,
//     },
//     1: {
//       uid: 'ID1',
//       date: 'FECHA1',
//       company: 'EMPRESA1',
//       company_id: 'ID',
//       name: 'Bla bla bla de cumplimiento',
//       no: 10,
//     }
//   }
// };

var surveyApp = new Vue({
  el: '#surveys',
  data: {
    sample: {
      headers: ['ID', 'empresa', 'clasificacion', 'No. preguntas'], 
      data: null
    },
    search: ''
  },
  methods:{
    searchByName: function(){
      let cache = this.sample.data;
      let chunk = this.search;
      if ( chunk != '' ){
        let regex = new RegExp('.*?' + chunk + '+.*?');
        let final = [];
        let result = _.find(this.sample.data, function(el) { return regex.test(el.name) });
        final.push(result);
        // console.log(result);
        this.sample.data = final;
      }
    }
  }
});