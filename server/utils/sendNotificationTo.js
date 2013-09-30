var mongoose = require('mongoose');
var User = mongoose.model('User');
var UA = require('urban-airship');

console.log('-----------------');
console.log(UA);
console.log('-----------------');

var ua = new UA("iaRoXjpsTdWiUTGHik_Paw",
								"oZAfBlMzSXyp6D_2umIE_g",
								"Kh94h34eTqS4y97_EARfWQ");

module.exports = function(config, token){

	if(token){

		var payload = {
			"device_tokens": token,
			"aps": config
		};

		ua.pushNotification("/api/push", payload, function(err) {

			if(err) console.log(err);
			else console.log('this has worked');

		});
	}

};