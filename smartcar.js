var gmAPI = require('./gm.js');

exports.vehicleInfo = function(req, res) {

	var id = req.params.id;

	gmAPI.vehicleInfo(id, onResult(res, transform1))
};

var onResult = function(res, transform) {
	return function(statusCode, result) {
		if (statusCode != 200) {
			res.status(statusCode).send(result.message);
		}
		else {
			var json = transform(res, result);
			if (json) {
				res.set('Content-type','application/json').send(JSON.stringify(json));
			}
		}
	}
};

var transform1 = function(res, result) {
	var json = {
		'vin': result.data.vin.value,
		'color': result.data.color.value,
		'doorCount': result.data.fourDoorSedan.value ? 4 : 2,
		'driveTrain': result.data.driveTrain.value
	};
	return json;
}

exports.security = function(req, res) {

	var id = req.params.id;

	gmAPI.security(id, onResult(res, transform2));
};

var transform2 = function(res, result) {
	var json = [];

	for (var i = 0, len = result.data.doors.values.length; i < len; i++) {
		var temp = {};
		temp.location = result.data.doors.values[i].location.value;
		
		temp.locked = result.data.doors.values[i].locked.value.toLowerCase() === 'true';
		
		json.push(temp);
	}
	return json;
};

exports.fuelRange = function(req, res) {

	var id = req.params.id;

	gmAPI.fuelBatteryLevel(id, onResult(res, transform3));
};

var transform3 = function(res, result) {
	var temp = result.data.tankLevel.value;
	if (temp.toLowerCase() === 'null') {
		res.status(400).send('This electric vehicle does not have a tank.');
		return;
	}
	return { 'percent': parseInt(temp) };
};

exports.batteryRange = function(req, res) {

	var id = req.params.id;

	gmAPI.fuelBatteryLevel(id, onResult(res, transform4));
};

var transform4 = function(res, result) {
	var temp = result.data.batteryLevel.value;
	if (temp.toLowerCase() === 'null') {
		res.status(400).send('This vehicle does not have a battery.');
		return;
	}
	return { 'percent': parseInt(temp) };
};

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

	gmAPI.startStopEngine(id, action, onResult(res, transform5));
};

var transform5 = function(res, result) {
	var temp = result.actionResult.status.toLowerCase();
	if (temp === 'executed') {
		return { 'status': 'success' };
	}
	else {
		return { 'status': 'error' };
	}
};