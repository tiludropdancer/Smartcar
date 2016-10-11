var express = require('express');
var app = express();
var bodyParser = require('body-parser');
module.exports = app;

// Create application/json parser
var jsonParser = bodyParser.json();

var smartcarAPI = require('./smartcar.js');

app.get('/vehicles/:id', smartcarAPI.vehicleInfo);
app.get('/vehicles/:id/doors', smartcarAPI.security);
app.get('/vehicles/:id/fuel', smartcarAPI.fuelRange);
app.get('/vehicles/:id/battery', smartcarAPI.batteryRange);
app.post('/vehicles/:id/engine', jsonParser, smartcarAPI.startStopEngine);

// Handle 404
app.use(function(req, res) {
	res.status(404).send('404: Not Found');
});

// Handle 500
app.use(function(error, req, res, next) {
	res.status(500).send('500: Internal Server Error');
});

app.listen(8080, function() {
	console.log('Server established and listening on port 8080.');
})