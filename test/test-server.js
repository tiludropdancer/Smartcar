var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../main');
var expect = chai.expect;

chai.use(chaiHttp);

//test improper vehicle id input, incorrect action in engineTest (should return statusCode 400)
//should I test 500 internal server error somewhere?

describe('vehicleInfoTest', function() {
	this.timeout(0);
	it('should list vin, color, doorCount, driveTrain on /vehicles/1234 GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/1234')
    		.end(function(err, res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('vin').that.is.a('string');
				expect(res.body).to.have.property('color').that.is.a('string');
				expect(res.body).to.have.property('doorCount').that.is.a('number');
				expect(res.body).to.have.property('doorCount').to.be.oneOf([2, 4]);
				expect(res.body).to.have.property('driveTrain').that.is.a('string');
				done();
			});
	});
	it('should list vin, color, doorCount, driveTrain on /vehicles/1235 GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/1235')
    		.end(function(err, res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('vin').that.is.a('string');
				expect(res.body).to.have.property('color').that.is.a('string');
				expect(res.body).to.have.property('doorCount').that.is.a('number');
				expect(res.body).to.have.property('doorCount').to.be.oneOf([2, 4]);
				expect(res.body).to.have.property('driveTrain').that.is.a('string');
				done();
			});
	});
	it('should not find /vehicles/888 GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/888')
    		.end(function(err, res) {
				expect(res).to.have.status(404);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Vehicle id: 888 not found.');
				done();
			});
	});
});

describe('securityTest', function() {
	this.timeout(0);
	it('should list location, locked on /vehicles/1234/doors GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/1234/doors')
    		.end(function(err, res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('array');
				expect(res.body).not.to.be.empty;
				for(var i = 0, len = res.body.length; i < len; i++) {
					var obj = res.body[i];
					expect(obj).to.be.an('object');
					expect(obj).to.have.property('location').that.is.a('string');
					expect(obj).to.have.property('locked').that.is.a('boolean');
				}
				done();
			});
	});
	it('should list location, locked on /vehicles/1235/doors GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/1235/doors')
    		.end(function(err, res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('array');
				expect(res.body).not.to.be.empty;
				for(var i = 0, len = res.body.length; i < len; i++) {
					var obj = res.body[i];
					expect(obj).to.be.an('object');
					expect(obj).to.have.property('location').that.is.a('string');
					expect(obj).to.have.property('locked').that.is.a('boolean');
				}
				done();
			});
	});
	it('should not find /vehicles/888/doors GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/888/doors')
    		.end(function(err, res) {
				expect(res).to.have.status(404);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Vehicle id: 888 not found.');
				done();
			});
	});
});

describe('fuelRangeTest', function() {
	this.timeout(0);
	it('should list percent on /vehicles/1234/fuel GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/1234/fuel')
    		.end(function(err, res) {
    			expect(res.status).to.be.oneOf([200, 400]);
    			if (res.status == 200) {
    				expect(res).to.be.json;
					expect(res.body).to.have.property('percent').that.is.a('number').within(0, 100);
    			}
    			else {
    				expect(res).to.have.status(400);
    				expect(res).to.be.html;
                	expect(res.text).to.be.string('This electric vehicle does not have a tank.');
    			}
				done();
			});
	});
	it('should list percent on /vehicles/1235/fuel GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/1235/fuel')
    		.end(function(err, res) {
				expect(res.status).to.be.oneOf([200, 400]);
    			if (res.status == 200) {
    				expect(res).to.be.json;
					expect(res.body).to.have.property('percent').that.is.a('number').within(0, 100);
    			}
    			else {
    				expect(res).to.have.status(400);
    				expect(res).to.be.html;
                	expect(res.text).to.be.string('This electric vehicle does not have a tank.');
    			}
				done();
			});
	});
	it('should not find /vehicles/888/doors GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/888/doors')
    		.end(function(err, res) {
				expect(res).to.have.status(404);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Vehicle id: 888 not found.');
				done();
			});
	});
});

describe('batteryRangeTest', function() {
	this.timeout(0);
	it('should list percent on /vehicles/1234/battery GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/1234/battery')
    		.end(function(err, res) {
				expect(res.status).to.be.oneOf([200, 400]);
    			if (res.status == 200) {
    				expect(res).to.be.json;
					expect(res.body).to.have.property('percent').that.is.a('number').within(0, 100);
    			}
    			else {
    				expect(res).to.have.status(400);
    				expect(res).to.be.html;
                	expect(res.text).to.be.string('This vehicle does not have a battery.');
    			}
				done();
			});
	});
	it('should list percent on /vehicles/1235/battery GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/1235/battery')
    		.end(function(err, res) {
				expect(res.status).to.be.oneOf([200, 400]);
    			if (res.status == 200) {
    				expect(res).to.be.json;
					expect(res.body).to.have.property('percent').that.is.a('number').within(0, 100);
    			}
    			else {
    				expect(res).to.have.status(400);
    				expect(res).to.be.html;
                	expect(res.text).to.be.string('This vehicle does not have a battery.');
    			}
				done();
			});
	});
	it('should not find /vehicles/888/battery GET', function(done) {
  		chai.request(server)
    		.get('/vehicles/888/battery')
    		.end(function(err, res) {
				expect(res).to.have.status(404);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Vehicle id: 888 not found.');
				done();
			});
	});
});

describe('startStopEngineTest', function() {
	this.timeout(0);
	it('should list status on START action /vehicles/1234/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1234/engine') //add body with {"action": "START"}
    		.send({action: 'START'})
    		.end(function(err, res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('status').that.is.a('string').oneOf(['success', 'error']);
				done();
			});
	});
	it('should list status on STOP action /vehicles/1234/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1234/engine') //add body with {"action": "STOP"}
    		.send({action: 'STOP'})
    		.end(function(err, res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('status').that.is.a('string').oneOf(['success', 'error']);
				done();
			});
	});
	it('should list status on START action /vehicles/1235/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1235/engine') //add body with {"action": "STOP"}
    		.send({action: 'START'})
    		.end(function(err, res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('status').that.is.a('string').oneOf(['success', 'error']);
				done();
			});
	});
	it('should list status on STOP action /vehicles/1235/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1235/engine') //add body with {"action": "STOP"}
    		.send({action: 'STOP'})
    		.end(function(err, res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('status').that.is.a('string').oneOf(['success', 'error']);
				done();
			});
	});
	it('should not find /vehicles/888/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/888/engine')
    		.send({action: 'START'})
    		.end(function(err, res) {
				expect(res).to.have.status(404);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Vehicle id: 888 not found.');
				done();
			});
	});
	it('should not find incorrect action value foo /vehicles/1234/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1234/engine')
    		.send({action: 'foo'})
    		.end(function(err, res) {
				expect(res).to.have.status(400);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Invalid action: foo');
				done();
			});
	});
	it('should not find incorrect action value Start /vehicles/1234/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1234/engine')
    		.send({action: 'Start'})
    		.end(function(err, res) {
				expect(res).to.have.status(400);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Invalid action: Start');
				done();
			});
	});
	it('should not find incorrect action value null /vehicles/1234/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1234/engine')
    		.send({action: null})
    		.end(function(err, res) {
				expect(res).to.have.status(400);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Action is required.');
				done();
			});
	});
	it('should not find incorrect action value empty string /vehicles/1234/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1234/engine')
    		.send({action: ''})
    		.end(function(err, res) {
				expect(res).to.have.status(400);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Action is required.');
				done();
			});
	});
	it('should not find incorrect data field Action /vehicles/1234/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1234/engine')
    		.send({Action: 'START'})
    		.end(function(err, res) {
				expect(res).to.have.status(400);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Action is required.');
				done();
			});
	});
	it('should not find incorrect data field foo /vehicles/1234/engine POST', function(done) {
  		chai.request(server)
    		.post('/vehicles/1234/engine')
    		.send({foo: 'START'})
    		.end(function(err, res) {
				expect(res).to.have.status(400);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('Action is required.');
				done();
			});
	});
});

describe('404Test', function() {
	this.timeout(0);
	it('should not find /foo/bar GET', function(done) {
  		chai.request(server)
    		.get('/foo/bar')
    		.end(function(err, res) {
				expect(res).to.have.status(404);
				expect(res).to.be.html;
            	expect(res.text).to.be.string('404: Not Found');
				done();
			});
	});
});