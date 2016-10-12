/**
* Utility module that helps making http requests to a RESTful web service
* (only POST method is implemented, GM API supports only POST requests)
*
* Author: Anastasia Radchenko
* Date: 10/11/16
*/


// Load http module
var http = require('http');

exports.post = function(options, data, onResult) {
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		var str = '';

		res.on('data', function(chunk){
			str += chunk;
		})

		res.on('end', function() {
			var json =  JSON.parse(str);
			var statusCode = Number(json.status);
			if (statusCode != 200) {
				onResult(statusCode, {'message':json.reason});
			}
			else {
				onResult(statusCode, json);
			}
		})
	})

	req.on('error', function(err) {
		onResult(500, err);
	});

	req.write(JSON.stringify(data));

	req.end();	
}