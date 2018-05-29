// var fs = require('fs');
// const examplefile = "example.txt";
// var content;

// fs.readFile(examplefile, function read(err, data) {
//   if (err) {
//       throw err;
//   }
//   content = data.toString('utf8');
//   convertDATAtoJSON(content);
// });
//
// TODO: Check for bad files!!!

/**
 * [convertDATAtoJSON  converts specific format into 'cuestionario' format of Firebase DB.]
 * @param  {[type]} data [UTF-8 information]
 * @return {[type]}      [JSON formated info]
 */
function convertDATAtoJSON( data ) {
  let text = data.split('\n');
  // TODO: No siempre la última línea contiene un \n por eso hay que verificar que hay en el último
  text.splice(0, 1);
  if ( text[text.length-1].length == 0) {
    text.splice(text.length - 1, 1);
  }
  let survey = [];

  for (var line in text) {

    let slice = text[line].split("||");
    let temp = { 'area': null, 'pregunta': null, 'puntaje': null, 'tipo': null, 'topic': null };
    temp['tipo'] = slice[0];
    temp['pregunta'] = slice[1];
    temp['puntaje'] = slice[2];
    temp['area'] = slice[3];
    temp['topico'] = slice[4];
    survey.push(temp);

  }

  return survey;
}

module.exports = convertDATAtoJSON;
