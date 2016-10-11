var rest = require('./rest.js');

var getOptions = function(uri) {
	var options = {
		host: 'gmapi.azurewebsites.net', 
		path: uri, 
		method: 'POST', 
		headers: {'Content-Type': 'application/json'}
	};
	return options;
}

exports.vehicleInfo = function(id, onResult1) {
	var options = getOptions('/getVehicleInfoService');
	var data = {'id': id, 'responseType': 'JSON'};
	rest.post(options, data, onResult1);
}

exports.security = function(id, onResult2) {
	var options = getOptions('/getSecurityStatusService');
	var data = {'id': id, 'responseType': 'JSON'};
	rest.post(options, data, onResult2);
}

exports.fuelBatteryLevel = function(id, onResult3_4) {
	var options = getOptions('/getEnergyService');
	var data = {'id': id, 'responseType': 'JSON'};
	rest.post(options, data, onResult3_4);
}

exports.startStopEngine = function(id, action, onResult5) {
	var options = getOptions('/actionEngineService');
	var command = action + '_VEHICLE';
	var data = {'id': id, 'command': command, 'responseType': 'JSON'};
	rest.post(options, data, onResult5);
}