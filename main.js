/**
* Main module of Web Application
*
* Author: Anastasia Radchenko
* Date: 10/11/16
*/

// Load express module
var express = require('express');
var app = express();
module.exports = app;

// Set default response content type to 'text/plain'
app.use(function(req, res, next) {
	res.contentType('text/plain');
	next();
});

var bodyParser = require('body-parser');

// Create application/json parser
var jsonParser = bodyParser.json();

// Load smartcar module
var smartcar = require('./smartcar.js');

// App routing table
app.get('/vehicles/:id', smartcar.vehicleInfo);
app.get('/vehicles/:id/doors', smartcar.security);
app.get('/vehicles/:id/fuel', smartcar.fuelRange);
app.get('/vehicles/:id/battery', smartcar.batteryRange);
app.post('/vehicles/:id/engine', jsonParser, smartcar.startStopEngine);

// Handle 404 error
app.use(function(req, res) {
	res.status(404).send('404: Not Found');
});

// Handle 500 error
app.use(function(error, req, res, next) {
	res.status(500).send('500: Internal Server Error');
});

// Kick off the application
app.listen(8080, function() {
	console.log('Server established and listening on port 8080.');
})