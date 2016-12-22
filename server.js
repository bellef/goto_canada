import express  from 'express'
import http     from 'http'
import parser   from 'xml2json'
import { filterParams, onlyUnique } from './utils'
var app         = express()
var port        = process.env.PORT || 8080

// set the view engine to ejs
app.set('view engine', 'ejs')

app.get('/', function(req, res){
  // URL
  var options = {
    host: 'www.cic.gc.ca',
    path: '/francais/travailler/eic/selection.xml' }

  // Scrape data
  http.get(options, (response) => {
    if (response.statusCode == 200) {
      var bodyChunks = []
      response.on('data', (chunk) => {
        bodyChunks.push(chunk)
      }).on('end', () => {
        // I Have my data !
        var body = Buffer.concat(bodyChunks).toString() // Concat all chunks to have a whole xml file
        var {temp: { country:countries }} = JSON.parse(parser.toJson(body)) // Extract countries

        // Get locations list for front select
        var locations = countries
                          .map(item => item.location)
                          .filter(onlyUnique)

        // Get stats with filters passed in url
        const { query: { category, location } } = req

        var stats = countries.filter((item) => filterParams(item, category, location))

        // Get categories for selected locations
        var categories = stats.map(item => item.category)

        // I return my data filtered
        res.json({
          locations,
          categories,
          stats
        })
      })
    }
  }).on('error', error => console.error(error))
})


app.get('/')

app.listen(port)

console.log("Magic happens on port " + port)
