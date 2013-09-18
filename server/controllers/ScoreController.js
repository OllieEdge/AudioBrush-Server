var mongoose = require('mongoose');
var async = require('async');

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

		//returns a score if there was a previous score to update.
		_updatePreviousScore.call(this, req, function(err, status){
			if(err){
				error('', res);
			}
			else if (status) {
				res.send(200, status);
			}
			else if (status == null) {
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
			}
			else{
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
	
	//Get the scores for the specified track and sort by score descending
	getScoresForTrack : function (req, res){
		var limit = 50;

		var searchTrackkey = sanitise.trackkey(req.params.trackkey);

		Score.find({trackkey:searchTrackkey})
			.lean()
			.populate({
				path:'trackId', 
				match:{trackkey:searchTrackkey}
			})
			.populate('userId')
			.limit(limit)
			.select('userId trackId score')
			.sort('-score')
			.exec(function (err, scores) {
				if (err) {
					error(err, res);
				}
				else if (scores) {
//					//We dont want the tracks that aren't for this track.
//					scores = scores.filter(function(scores){
//					     return scores.trackId.length;
//					 });
					res.send(200, scores);
				}
			});
	},
	
	deleteAllScores : function (req, res){
		Score.find()
		.exec(function (err, scores) {
			if (err) {
				error(err, res);
			}
			else if (scores) {
				var i = scores.length;
				while (i--) {
					 scores[i].remove();
				}
				res.send(200, {});
			}
		});
	},

	//kinda private api
	getNewScore: function () {
		return _getNewScore.apply(this, arguments);
	}
};


//Attempt to update a previous score.
function _updatePreviousScore(req, next){
	
	var trackkey = req.body.trackkey;
	var facebookID  = req.body.fb_id;
	var score     = req.body.score;
	var userId = "";
	
	 if (!score || !trackkey || !facebookID) {
			next('error');
			return;
	}
	 
	 User.findOne({fb_id:facebookID})
	 .select('_id')
	 .exec(function (err, user) {
         if (err) {
        	 next('error');
         }
         else if (user) {
        	 userId = user._id;
        	 
        	 Score.findOne({trackkey:trackkey, userId:userId})
        	 .exec(function (err, scores) {
        			if (err) {
        				next('error');
        			}
        			else if (scores) {
        				if(score > scores.score){
	        				scores.score = score;
	        				scores.save();
        				}
        				next(null, scores);
        			}
        			else if(scores == null){
        				next(null, null);
        			}
        			else {
        				next('error');
        			}
        		});
        	 
        	 
         }
         else{
        	 next('error');
         }
	 });
}

// private
function _getNewScore(req, next) {

	var trackkey = req.body.trackkey;
	var facebookID  = req.body.fb_id;
	var score     = req.body.score;

    if (!score || !trackkey || !facebookID) {
		next('error');
		return;
	}


    console.log(score, trackkey, facebookID);

	async.parallel([
		function (callback) {
			return Track.findOne({trackkey: trackkey}).lean().exec(callback);
		},
		function (callback) {
			return User.findOne({fb_id: facebookID}).lean().exec(callback);
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
				score  : score,
				trackkey : track.trackkey
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

