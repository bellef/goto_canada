var express     = require('express');
var app         = express();
var http        = require('http');
var parser      = require('xml2json');
var port        = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

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

        // Get locations list
        var locations = json.temp.country.map(function(item) {
          return item.location;
        });
        locations = locations.filter(onlyUnique);

        // Get stats with filters passed in url
        var stats = json.temp.country.filter(function(item) {
          if (req.query.location) {
            if (req.query.category)
              return (item.category == req.query.category && item.location == req.query.location);
            else
              return (item.location == req.query.location);
          }
          else
            return true;
        });

        // Get categories for selected locations
        var categories = stats.map(function(item) {
          return (item.category);
        });

        // I return my data filtered
        res.render('pages/index', {
          locations:  locations,
          categories: categories,
          stats:      stats
        });
      });
    }
  }).on('error', function(error) {
    console.error(error);
  });
})


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

app.get('/')

app.listen(port);

console.log("Magic happens on port " + port);

exports = module.exports = app;
