var express     = require('express');
var app         = express();
var http        = require('http');
var parser      = require('xml2json');


app.get('/', function(req, res){
  // URL
  options = {
    host: 'www.cic.gc.ca',
    path: '/francais/travailler/eic/selection.xml' }

  // Scrape data
  http.get(options, function(response) {
    if (response.statusCode == 200) {
      var bodyChunks = [];
      response.on('data', function(chunk) {
        bodyChunks.push(chunk);
      }).on('end', function() {
        // I Have my data !
        var body = Buffer.concat(bodyChunks).toString(); // Concat all chunks to have a whole xml file
        var json = JSON.parse(parser.toJson(body));

        data_to_render = json.temp.country.filter(function(item) {
          if (req.query.location) {
            if (req.query.category)
              return (item.category == req.query.category && item.location == req.query.location);
            else
              return (item.location == req.query.location);
          }
          else
            return true;
        });

        res.json(data_to_render);
        // I Have my data !
      });
    }
  }).on('error', function(error) {
    console.error(error);
  });
})


app.get('/')

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
