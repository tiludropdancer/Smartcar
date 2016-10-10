var express = require('express');
var app = express();

var smartcarAPI = require('./smartcar.js');

app.get('/vehicles/:id', smartcarAPI.vehicleInfo);
app.get('/vehicles/:id/doors', smartcarAPI.security);
app.get('/vehicles/:id/fuel', smartcarAPI.fuelRange);
app.get('/vehicles/:id/battery', smartcarAPI.batteryRange);
app.get('/vehicles/:id/engine', smartcarAPI.startStopEngine);

app.listen(8080, function() {
	console.log('Server established and listening on port 8080.');
})