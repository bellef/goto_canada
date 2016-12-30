import express  from 'express'
import http     from 'http'
import parser   from 'xml2json'
import { filterParams, onlyUnique, sanitizeItem } from './utils'
var app         = express()
var port        = process.env.PORT || 8080

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  scrapeRender(req, res, 'index')
})

app.get('/stats', function(req, res){
  scrapeRender(req, res, 'stats')
})

const scrapeRender = (req, res, page) => {
  // URL
  var options = {
    host: 'www.cic.gc.ca',
    path: '/francais/travailler/eic/selection.xml' }

  http.get(options, (response) => {
    if (response.statusCode == 200) {
      var body = ''
      response.on('data', (chunk) => {
        body += chunk
      }).on('end', () => {
        // Data retrieved
        var {temp: { country:countries }} = JSON.parse(parser.toJson(body)) // Extract countries

        // Get locations list for front select
        var locations = countries
                          .map(item => item.location)
                          .filter(onlyUnique)
                          .sort()

        // Extract category and location from request
        const { query: { category, location } } = req

        // Get stats with filters passed in url
        var stats = countries
                      .filter(item => filterParams(item, category, location))
                      .map(item => sanitizeItem(item))

        // Get categories for filtered locations
        var categories = stats.map(item => item.category)

        // Return filtered data
        res.render('pages/' + page, {
          locations,
          categories,
          stats
        })
      })
    }
  }).on('error', error => console.error(error))
}

app.listen(port)

console.log("Magic happens on port " + port)
