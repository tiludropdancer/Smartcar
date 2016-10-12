/**
* Module that implements Smartcar API by delegating to GM API module methods
*
* Author: Anastasia Radchenko
* Date: 10/11/16
*/

// Load gm module
var gm = require('./gm.js');

// Get vehile info data from gm module and pass respective transformer to a callback
exports.vehicleInfo = function(req, res) {

	var id = req.params.id;

	gm.vehicleInfo(id, onResult(res, transformVehicleInfo))
};

// Helper method that creates a callback to process data received from GM service
var onResult = function(res, transform) {
	// Create the callback function
	return function(statusCode, result) {
		if (statusCode != 200) {
			// Handle the error
			res.status(statusCode).send(result.message);
		}
		else {
			// Apply data trasformer
			var json = transform(res, result);
			if (json) {
				// Send transformed data to client
				res.contentType('application/json').send(JSON.stringify(json));
			}
		}
	}
};

// Transforms vehicle info into smartcar format
var transformVehicleInfo = function(res, result) {
	var json = {
		'vin': result.data.vin.value,
		'color': result.data.color.value,
		'doorCount': result.data.fourDoorSedan.value ? 4 : 2,
		'driveTrain': result.data.driveTrain.value
	};
	return json;
}

// Get vehile security data from gm module and pass respective transformer to a callback
exports.security = function(req, res) {

	var id = req.params.id;

	gm.security(id, onResult(res, transformSecurity));
};

// Transforms security info into smartcar format
var transformSecurity = function(res, result) {
	var json = [];

	for (var i = 0, len = result.data.doors.values.length; i < len; i++) {
		var temp = {
			location: result.data.doors.values[i].location.value,
			locked: result.data.doors.values[i].locked.value.toLowerCase() === 'true'
		};
		json.push(temp);
	}
	return json;
};

// Get fuel tank level data from gm module and pass respective transformer to a callback
exports.fuelRange = function(req, res) {

	var id = req.params.id;

	gm.fuelBatteryLevel(id, onResult(res, transformFuelLevel));
};

// Transforms fuel level into smartcar format
var transformFuelLevel = function(res, result) {
	var temp = result.data.tankLevel.value;
	if (temp.toLowerCase() === 'null') {
		res.status(400).send('This electric vehicle does not have a tank.');
		return;
	}
	return {percent: parseInt(temp)};
};

// Get battery level data from gm module and pass respective transformer to a callback
exports.batteryRange = function(req, res) {

	var id = req.params.id;

	gm.fuelBatteryLevel(id, onResult(res, transformBatteryLevel));
};

// Transforms battery level into smartcar format
var transformBatteryLevel = function(res, result) {
	var temp = result.data.batteryLevel.value;
	if (temp.toLowerCase() === 'null') {
		res.status(400).send('This vehicle does not have a battery.');
		return;
	}
	return {percent: parseInt(temp)};
};

// Send start/stop engine action to gm module and pass respective transformer to a callback
exports.startStopEngine = function(req, res) {
	var id = req.params.id;
	var action = req.body.action;

	if (!action || action.trim() === '') {
		res.status(400).send('Action is required.');
		return;
	} 
	
	if (action !== 'START' && action !== 'STOP') {
		res.status(400).send('Invalid action: '+action);
		return;
	}

	gm.startStopEngine(id, action, onResult(res, transformActionStatus));
};

// Transforms start/stop engine action result into smartcar format
var transformActionStatus = function(res, result) {
	var temp = result.actionResult.status.toLowerCase();
	if (temp === 'executed') {
		return {status: 'success'};
	}
	else {
		return {status: 'error'};
	}
};