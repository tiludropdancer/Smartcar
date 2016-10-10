var express = require('express');
var app = express();
var http = require('http');

app.get('/vehicles/:id', function(req, res) {
	var options = {
		host: 'gmapi.azurewebsites.net', 
		path: '/getVehicleInfoService', 
		method: 'POST', 
		headers: {'Content-Type': 'application/json'}
	};

	console.log('smartcar request received');

	//connect to GM server
	var gmReq = http.request(options, function(gmRes) {
		console.log('GM response received');
		gmRes.setEncoding('utf8');
		var str = '';

		gmRes.on('data', function(chunk){
			str += chunk;
			console.log('chunk received');
		})

		gmRes.on('end', function() {
			console.log('end of data');
			console.log('str: ' + str);
			var json =  JSON.parse(str);

			if (json.status != '200') {
				res.status(json.status).send(json.reason);
				return;
			}

			//send response to Smartcar
			var resJSON = {};
			resJSON.vin = json.data.vin.value;
			resJSON.color = json.data.color.value;
			if (json.data.fourDoorSedan.value) {
				resJSON.doorCount = 4;
			}
			else {
				resJSON.doorCount = 2;
			}
			resJSON.driveTrain = json.data.driveTrain.value;

			console.log('Json object created: ' + JSON.stringify(resJSON));

			res.send(JSON.stringify(resJSON));
		})
	});

	gmReq.on('error', function(err) {
		res.status(500).send(err.message);
	});

	var idValue = req.params.id;
	var smartcarJSON = {'id': idValue, 'responseType': 'JSON'};

	gmReq.write(JSON.stringify(smartcarJSON));

	gmReq.end();
})

app.get('/vehicles/:id/doors', function(req, res) {
	var options = {
		host: 'gmapi.azurewebsites.net', 
		path: '/getSecurityStatusService', 
		method: 'POST', 
		headers: {'Content-Type': 'application/json'}
	};

	//connect to GM server
	var gmReq = http.request(options, function(gmRes) {
		gmRes.setEncoding('utf8');
		var str = '';

		gmRes.on('data', function(chunk){
			str += chunk;
		})

		gmRes.on('end', function() {
			console.log('received from GM: ' + str);

			var json =  JSON.parse(str);

			if (json.status != '200') {
				res.status(json.status).send(json.reason);
				return;
			}

			//send response to Smartcar
			var resJSON = [];

			for(var i = 0, len = json.data.doors.values.length; i < len; i ++) {
				var temp = {};
				temp.location = json.data.doors.values[i].location.value;
				
				temp.locked = json.data.doors.values[i].locked.value.toLowerCase() === "true";
				
				resJSON.push(temp);
			}

			console.log('Json object created: ' + JSON.stringify(resJSON));

			res.send(JSON.stringify(resJSON));
		})
	});

	gmReq.on('error', function(err) {
		res.status(500).send(err.message);
	});

	var idValue = req.params.id;
	var smartcarJSON = {'id': idValue, 'responseType': 'JSON'};

	gmReq.write(JSON.stringify(smartcarJSON));

	gmReq.end();
})

app.get('/vehicles/:id/fuel', function(req, res) {
	res.send('id/fuel');
})

app.get('/vehicles/:id/battery', function(req, res) {
	res.send('id/battery');
})

app.post('/vehicles/:id/engine', function(req, res) {
	res.send('id/engine');
})

app.listen(8080, function() {
	console.log('Server established and listening on port 8080.');
})