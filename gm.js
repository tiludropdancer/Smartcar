/**
* Module that makes requests to GM RESTful API endpoints
*
* Author: Anastasia Radchenko
* Date: 10/11/16
*/

// Load rest module
var rest = require('./rest.js');

// Helper method to build HTTP request options
var getOptions = function(uri) {
	var options = {
		host: 'gmapi.azurewebsites.net', 
		path: uri, 
		method: 'POST', 
		headers: {'Content-Type': 'application/json'}
	};
	return options;
}

// Send request for vehicle info to GM service
exports.vehicleInfo = function(id, onResult) {
	var options = getOptions('/getVehicleInfoService');
	var data = {'id': id, 'responseType': 'JSON'};
	rest.post(options, data, onResult);
}

// Send request for security info to GM service
exports.security = function(id, onResult) {
	var options = getOptions('/getSecurityStatusService');
	var data = {'id': id, 'responseType': 'JSON'};
	rest.post(options, data, onResult);
}

// Send request for fuel/battery level to GM service
exports.fuelBatteryLevel = function(id, onResult) {
	var options = getOptions('/getEnergyService');
	var data = {'id': id, 'responseType': 'JSON'};
	rest.post(options, data, onResult);
}

// Send command to start/stop engine to GM service
exports.startStopEngine = function(id, action, onResult) {
	var options = getOptions('/actionEngineService');
	var command = action + '_VEHICLE';
	var data = {'id': id, 'command': command, 'responseType': 'JSON'};
	rest.post(options, data, onResult);
}