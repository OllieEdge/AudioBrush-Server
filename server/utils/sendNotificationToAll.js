var mongoose = require('mongoose');
var User = mongoose.model('User');
var UA = require('urban-airship');

console.log('-----------------');
console.log(UA);
console.log('-----------------');

var ua = new UA("p81WhN-1S-igoV3DcgKulw",
								"hcruaIB9RFqtR-ocNlXGtA",
								"S833gXIaSyyI7nu2mTpzkQ");

module.exports = function(config){

	User
		.find()
		.select('airship_token')
		.exec(function(err, users){

			if(err) console.log(err);
			else{

				var tokens = [];

				if(users.length > 0){

					for(var i in users){

						var user = users[i];

						if(user.airship_token) tokens.push(user.airship_token);

					}

				}

				if(tokens.length > 0){

					var payload = {
						"device_tokens": tokens,
						"aps": config
					};


					ua.pushNotification("/api/push", payload, function(err) {

						if(err) console.log(err);
						else console.log('this has worked');

					});


				}



			}

		});

};