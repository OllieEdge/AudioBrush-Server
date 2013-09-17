var mongoose = require('mongoose');
var async = require('async')

//models
var User = mongoose.model('User');
var Track = mongoose.model('Track');
var Score = mongoose.model('Score');

//utils
var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');

//api
module.exports = {
	createScore: function (req, res) {

		console.log('CREATING SCORES');

		//this needs to be more dry
		_getNewScore.call(this, req, function (err, score) {
			if (err) {
				error('', res);
			}
			else if (score) {
				res.send(200, score);
			}
			else {
				error('', res);
			}
		});
	},

	getScores  : function (req, res) {
		var limit = 50;

		var sort = req.body.sort;

		Score.find()
			.lean()
			.populate('trackId')
			.populate('userId')
			.sort(sort)
			.limit(limit)
			.select('userId trackId score')
			.exec(function (err, scores) {
				if (err) {
					error(err, res);
				}
				else if (scores) {
					res.send(200, scores);
				}
			});
	},

	//kinda private api
	getNewScore: function () {
		return _getNewScore.apply(this, arguments);
	}
};

// private
function _getNewScore(req, next) {

	var trackname = req.params.trackname;
	var username  = req.body.username;
	var score     = req.body.score;

    if (!score || !trackname || !username) {
		next('error');
		return;
	}


    console.log(score, trackname, username);

	async.parallel([
		function (callback) {
			return Track.findOne({trackname: trackname}).lean().exec(callback);
		},
		function (callback) {
			return User.findOne({username: username}).lean().exec(callback);
		}
	], function (err, results) {

		var track = results[0];
		var user = results[1];

        console.log(track, user);

		if (track && user) {
			console.log('writing', score);
			var scoreObj = new Score({//make new score
				trackId: track._id,
				userId : user._id,
				score  : score
			}).save(function (err, score) {
					if (err) {
						next('error');
					}
					else {
						next(null, score);
					}
				});
		}
		else {
			next('error');
		}
	});
}

