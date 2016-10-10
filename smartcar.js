var gmAPI = require('./gm.js');

exports.vehicleInfo = function(req, res) {

	var id = req.params.id;

	gmAPI.vehicleInfo(id, onResult1);
};

var onResult1 = function(statusCode, result){
	if (statusCode != 200) {
		res.status(statusCode).send(result.message);
	}
	else {
		//send response to Smartcar
		var resJSON = {};
		resJSON.vin = result.data.vin.value;
		resJSON.color = result.data.color.value;
		if (result.data.fourDoorSedan.value) {
			resJSON.doorCount = 4;
		}
		else {
			resJSON.doorCount = 2;
		}
		resJSON.driveTrain = result.data.driveTrain.value;

		res.send(JSON.stringify(resJSON));
	}
};

var onResult = function(statusCode, result){
	if (statusCode != 200) {
		res.status(statusCode).send(result.message);
	}
	else {
		//send response to Smartcar
		var resJSON = {};
		resJSON.vin = result.data.vin.value;
		resJSON.color = result.data.color.value;
		if (result.data.fourDoorSedan.value) {
			resJSON.doorCount = 4;
		}
		else {
			resJSON.doorCount = 2;
		}
		resJSON.driveTrain = result.data.driveTrain.value;

		res.send(JSON.stringify(resJSON));
	}
};

var cb = function(res, result) {

} 


exports.security = function(req, res) {

	var id = req.params.id;

	gmAPI.security(id, onResult2);
};

var onResult2 = function(statusCode, result) {
	if (statusCode != 200) {
		res.status(statusCode).send(result.message);
	}
	else {
		//send response to Smartcar
		var resJSON = [];

		for(var i = 0, len = json.data.doors.values.length; i < len; i ++) {
			var temp = {};
			temp.location = json.data.doors.values[i].location.value;
			
			temp.locked = json.data.doors.values[i].locked.value.toLowerCase() === "true";
			
			resJSON.push(temp);
		}

		res.send(JSON.stringify(resJSON));
	}
};

exports.fuelRange = function(req, res) {

	var id = req.params.id;

	gmAPI.fuelBatteryLevel(id, onResult3);
};

var onResult3 = function(statusCode, result) {
	if (statusCode != 200) {
		res.status(statusCode).send(result.message);
	}
	else {
		var temp = result.data.tankLevel.value;
		if (temp.toLowerCase() === 'null') {
			res.status(400).send('This electric vehicle does not have a tank.');
		}
		else {
			res.send(JSON.stringify({'percent': Number(temp)}));
		}
	}
};

exports.batteryRange = function(req, res) {

	var id = req.params.id;

	gmAPI.fuelBatteryLevel(id, onResult4);
};

var onResult4 = function(statusCode, result) {
	if (statusCode != 200) {
		res.status(statusCode).send(result.message);
	}
	else {
		var temp = result.data.batteryLevel.value;
		if (temp.toLowerCase() === 'null') {
			res.status(400).send('This vehicle does not have a battery.');
		}
		else {
			res.send(JSON.stringify({'percent': Number(temp)}));
		}
	}
};

exports.startStopEngine = function(req, res) {
	var id = req.params.id;
	var action = req.body.action;

	gmAPI.startStopEngine(id, action, onResult5);

};

var onResult5 = function(statusCode, result) {
	if (statusCode != 200) {
		res.status(statusCode).send(result.message);
	}
	else {
		var temp = result.actionResult.status.toLowerCase();
		if (temp === 'executed') {
			res.send(JSON.stringify({'status': 'success'}));
		}
		else {
			res.send(JSON.stringify({'status': 'error'}));
		}
	}
};