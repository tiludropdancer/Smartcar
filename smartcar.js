/**
* Module that implements Smartcar API by delegating to GM API methods
*
* Author: Anastasia Radchenko
* Date: 10/11/16
*/


// Loads gm module
var gmAPI = require('./gm.js');

// Gets data from gm module and passes respective transformer
exports.vehicleInfo = function(req, res) {

	var id = req.params.id;

	gmAPI.vehicleInfo(id, onResult(res, transformVehicleInfo))
};

// takes our express response and GM-to-Smartcar payload transformer 
// and returns a callback, that will apply that transformer to a data
// received from the GM service, and will send transformed data or an error
// to our client
var onResult = function(res, transform) {
	return function(statusCode, result) {
		if (statusCode != 200) {
			res.status(statusCode).send(result.message);
		}
		else {
			var json = transform(res, result);
			if (json) {
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

// Gets data from gm module and passes respective transformer
exports.security = function(req, res) {

	var id = req.params.id;

	gmAPI.security(id, onResult(res, transformSecurity));
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

// Gets data from gm module and passes respective transformer
exports.fuelRange = function(req, res) {

	var id = req.params.id;

	gmAPI.fuelBatteryLevel(id, onResult(res, transformFuelLevel));
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

// Gets data from gm module and passes respective transformer
exports.batteryRange = function(req, res) {

	var id = req.params.id;

	gmAPI.fuelBatteryLevel(id, onResult(res, transformBatteryLevel));
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

// Sends command to GM service and passes respective transformer
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

	gmAPI.startStopEngine(id, action, onResult(res, transformActionStatus));
};

// Transforms action result into smartcar format
var transformActionStatus = function(res, result) {
	var temp = result.actionResult.status.toLowerCase();
	if (temp === 'executed') {
		return {status: 'success'};
	}
	else {
		return {status: 'error'};
	}
};