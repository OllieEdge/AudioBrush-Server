var mongoose = require('mongoose');
var User = mongoose.model('User');

var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');

module.exports = {
	//  CREATE USER
	//  ------------------------
	createUser: function (req, res) {

		if (req.params.username) {
			var facebookID = sanitise.username(req.params.username);

			// query db for existing player with username
			User
				.find({ role: 'player', fb_id: facebookID })
				.limit(1)
				.exec(function (err, user) {

					/* TODO ADD ROBUST ERROR HANDELING */
					if (err) {
						error(err);
					}

					else {
						if (user.length <= 0) { //check if existing user exists
							var user = new User(req.body);//make new user

							User.register(user, req.body.password, function (err, user) {

								if (err) {
									console.log(err)
									res.send(500)
								}
								else if (user) {
									res.send(200, user);//on success send user
								}

							})

						}
						else {
							res.send(401, new Error());//send 401
						}
					}
				});
		}
		else {
			error();
		}
	},

	//  READ USER
	//  ------------------------
	readUser  : function (req, res) {

		if (req.params.username) {
			var facebookID = sanitise.username(req.params.username);//sanitise the input

			User
				.find({ role: 'player', fb_id: facebookID })
				.exec(function (err, user) {
					if (err) {
						error(err);
					}
					else {
						res.send(200, user);
					}
				});
		}

		else {
			res.send(400, new Error('Please use a resource identifier'));
		}

	},

	//  READ COLLECTION OF USERS
	//  ------------------------
	readUsers : function (req, res) {

		var limit = req.body.limit ? sanitise.limit(req.body.limit) : 10;
		var sort = req.body.sort ? sanitise.sort(req.body.sort) : '-updated';

		User.find({ role: 'player' })
			.limit(limit)
			.sort(sort)
			.select('role username created updated')
			.exec(function (err, users) {
				if (err) {
					error(err);
				}
				else {
					res.send(200, users);
				}
			});

	},

	//  UPDATE USER
	//  ------------------------
	updateUser: function (req, res) {

		//check for the route user name /update/user/:username
		var facebookID = req.params.username ? sanitise.username(req.params.username) : null;//sanitise the input

		//check for the change of username
		var newUsername = req.body.username ? sanitise.username(req.body.username) : null;
		var newCredits = req.body.credits ? sanitise.credits(req.body.credits) : null;
		var newUnlimited = req.body.unlimited ? sanitise.unlimited(req.body.unlimited) : null;
		var airshipToken = req.body.airship_token;

		if (facebookID) {
			User
				.findOne({ fb_id: facebookID })
				.exec(function (err, user) {

					if (err) {
						error(err, res);
					}
					else if (user) {
						user.username = newUsername ? newUsername : user.username;
						user.credits = newCredits ? newCredits : user.credits;
						user.unlimited = newUnlimited ? newUnlimited : user.credits;
						user.airship_token = airshipToken;
						user.save(function (err, user) {
							if (err) {
								error(err, res);
							}
							else {
								res.send(200, user);
							}
						});
					}
				});

		}
		else {
			error(new Error('No FacebookID Provided'), res);
		}

	},

	//  DELETE USER
	//  ------------------------
	deleteUser: function (req, res) {
		var facebookID = req.params.username ? sanitise.username(req.params.username) : null;//sanitise the input

		if (facebookID) {
			User
				.findOne({ role: 'player', fb_id: facebookID })
				.exec(function (err, user) {

					if (err) {
						error(err, res);
					}
					else if (user) {
						user.remove();
						res.send(200, {});
					}

				});
		}
	},

	loginUser: function (req, res) {
		console.log(req.user);
		res.send(200);
	}
};