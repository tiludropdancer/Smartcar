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
}