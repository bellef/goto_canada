var express     = require('express');
var app         = express();
var http        = require('http');
var parser      = require('xml2json');


// TODO: Créer des routes séparées pour chaque pays et chaque type de visa
app.get('/', function(req, res){

  options = {
    host: 'www.cic.gc.ca',
    path: '/francais/travailler/eic/selection.xml' }

  request = http.get(options, function(response) {
    if (response.statusCode == 200) {
      var bodyChunks = [];
      response.on('data', function(chunk) {
        bodyChunks.push(chunk);
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks).toString(); // Concat all chunks to have a whole xml file
        var json = JSON.parse(parser.toJson(body));

        frances = json.temp.country.filter(function(item) {
          return item.location == "France";
        });

        res.json(frances);
      });
    }
  });
  request.on('error', function(error) {
    console.error(error);
  });
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
