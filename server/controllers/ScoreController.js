var mongoose = require('mongoose');
var async = require('async');

//models
var User = mongoose.model('User');
var Track = mongoose.model('Track');
var Score = mongoose.model('Score');

//utils
var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');
var xpCalculator = require('../utils/XPCalculator');

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
				_setupNewScore.call(this, req, function (err, score) {
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
			.select('userId trackId score starrating')
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
		
		var searchTrackkey = sanitise.trackkey(req.params.trackkey);
		var limit = req.body.limit;
		
		
		Score.find({trackkey:searchTrackkey})
			.lean()
			.populate({
				path:'trackId', 
				match:{trackkey:searchTrackkey}
			})
			.populate('userId')
			.limit(limit)
			.select('userId trackId score starrating')
			.sort('-score')
			.exec(function (err, scores) {
				if (err) {
					error(err, res);
				}
				else if (scores) {
//					//We don't want the tracks that aren't for this track.
//					scores = scores.filter(function(scores){
//					     return scores.trackId.length;
//					 });
					res.send(200, scores);
				}
			});
	},
	
	//Get the scores for the specified track and sort by score descending
	getScoresForTrackWithUserIDs : function (req, res){
		
		var searchTrackkey = sanitise.trackkey(req.params.trackkey);
		var friendFacebookIDs = sanitise.facebookIDs(req.body.friends);
		var friendScores = new Array();
		
		Score.find({trackkey:searchTrackkey})
			.lean()
			.populate('trackId')
			.populate('userId')
			.select('userId trackId score starrating')
			.sort('-score')
			.exec(function (err, scores) {
				if (err) {
					console.log("There was an error gets the friends score for this track");
					error(err, res);
				}
				else if (scores) {
					for(var i = 0; i < friendFacebookIDs.length;i++){
    					for(var t = 0; t < scores.length; t++){
    						if(scores[t].userId[0].fb_id == parseInt(friendFacebookIDs[i])){
    							scores[t].rank = scores.indexOf(scores[t])+1;
    							friendScores.push(scores[t]);
    							break;
    						}
    					}
    				}
					res.send(200, friendScores);
				}
				else{
					console.log("There was an error gets the friends score for this track");
					error(err, res);
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


//--------------------------------------------
//UPDATES A PREVIOUS SCORE IN THE DATABASE
//If a previous score doesn't exist it will return null.
//--------------------------------------------
function _updatePreviousScore(req, next){
	
	var trackkey = req.body.trackkey;
	var facebookID  = req.body.fb_id;
	var score     = req.body.score;
	var starrating = req.body.starrating;
	var precisestarrating = req.body.precisestarrating;
	var userId = "";
	var xpRewarded = xpCalculator(req.body.difficulty, precisestarrating);
	
	 if (!score || !trackkey || !facebookID) {
		 console.log("Missing update score parameters, params required: trackkey, fb_id, score");
			next('error');
			return;
	}
	 
	 User.findOne({fb_id:facebookID})
	 .select('_id xp')
	 .exec(function (err, user) {
         if (err) {
        	 next('error');
         }
         else if (user) {
        	 userId = user._id;
        	 
        	 console.log("Attempting update of users score: " + facebookID);
        	 
        	 async.parallel([
	         		function (callback) {
	         			//This finds if the scores record for this track and user already exists.
	         			return Score.findOne({trackkey:trackkey, userId:userId}).exec(callback);
	         		},
	         		function (callback) {
	         			//This finds all the scores greater or equal to the one that we're posting.
	         			return Score.find({trackkey:trackkey, score:{$gte:score}}).lean().exec(callback);
	         		},
	         		function (callback) {
	        			return Track.findOne({trackkey: trackkey}).exec(callback);
	        		}
	         	], function (err, results) {
        		 
        		 	var previousScore = results[0];
        			var scoresGreaterOrEqualToThisScore = results[1];
        			var track = results[2];
        			
        			if(err){
        				console.log("There was an error whilst calling the update asyncronous method.");
        				next('error');
        			}
        			else if(previousScore && scoresGreaterOrEqualToThisScore){
        				previousScore.xpRewarded = xpRewarded;
        				//Save the rewarded XP to the user.
        				user.xp = user.xp + xpRewarded;
        	        	user.save();
        	        	 
        				//Only update the score is the new one is greater than the old one. The client won't send a request unless it knows the score is greater but this is a precaution.
        				if(score > previousScore.score){
        					previousScore.score = score;
        					previousScore.starrating = starrating;
        					console.log("Saving new score.");
        					previousScore.save();
        					console.log("Saved new score.");
        					previousScore.rank = scoresGreaterOrEqualToThisScore.length+1;
            				next(null, previousScore);
        				}
        				else{
        					//Get the old score - we set the req.body score parameter to the previous score so that we can search for this rank.	
        					req.body.score = previousScore.score;
        					//We parse the score that we've already found so that we don't have to search for it again.
        					_getRankingForScore(req, next, previousScore);
        				}
        				incrementTrack(track);
        				
        			}
        			else if(previousScore == null){
        				console.log("Specified user has not played this track before, moving on to create a new score document.");
        				next(null, null);
        			}
        			else if(scoresGreaterOrEqualToThisScore == null){
        				console.log("There was an error attempting to get the rank of this user for this track.");
        			}
        			else{
        				next('error');
        			}
        		 
        	 });
         }
         else{
        	 console.log("Couldn't find the user specified whilst updating the score.");
        	 next('error');
         }
	 });
}

//--------------------------------------------
//GET THE RANK FOR THE SCORE PROVIDED
//--------------------------------------------
function _getRankingForScore(req, next, score){
	
	if(score){
		//Get all the scores for this track that are greater or equal to the score provided.
		Score.find({trackkey:score.trackkey, score:{$gte:score.score}})
		.lean()
		.exec(
				function (err, results) {
					if(err){
						console.log("There was a problem getting the rank for the score document provided.");
					}
					else if(results){
						console.log("Using old rank for the score provided.");
						score.rank = results.length;
						next(null, score);
					}
					else{
						console.log("There was a problem getting the rank for the score document provided.");
					}
				}
		);
	}
	else{
		console.log("A score document needs to be parsed in order to find the ranking.");
	}
}

//--------------------------------------------
//PREPARES EVERYTHING FOR A NEW SCORE
//When posting a new score document, their needs to be a valid track 
//document for the score document. This makes sure that the track exists.
//If it doesn't exist it will create one.
//--------------------------------------------
function _setupNewScore(req, next) {

	var trackkey = req.body.trackkey;
	var facebookID  = req.body.fb_id;
	var score     = req.body.score;
	var trackname = req.body.trackname;
	var artist = req.body.artist;
	var difficulty = req.body.difficulty;
	

	//Make sure the compulsory parameters are set
    if (!score || !trackkey || !facebookID) {
    	console.log("Missing parameters to save new score, params required are: trackkey, fb_id, score");
		next('error');
		return;
	}
    
    //	Make sure that the track exists before posting the new score.
    getExistingTrack(trackkey)
    .then(function (track) {
    	if (track) {
    		
    		//Save the score and pass on the responsibility
    		saveNewHighscore(req, next);
    		
    	}
    	else {
    		//Make sure that the track parameters are set.
    		if(!trackname || !artist || !difficulty){
    			console.log("Missing parameters to save a new track. When posting a new score make sure that there are the track parameters too: trackname, artist, trackkey, difficulty");
    			next('error');
    			return;
    		}
    		console.log("Track for this score doesn't exist, creating a new track...");
    		//Create the new track document
    		return saveNewTrack({ trackname: trackname, artist: artist , trackkey: trackkey, difficulty:difficulty});
    	}
    })
    .then(function (track) {//Once a new track is saved then do this...
    	if (track) {
    		
    		//Save the score and pass on the responsibility
    		saveNewHighscore(req, next);
    		
    	}
    	else {
    		console.log("There was a problem creating a new track document when posting the new score.");
    		next('error');
    	}
    });
}

//--------------------------------------------
//SAVE A NEW SCORE
//This method is only used when there is no current score document for the specified track
//--------------------------------------------
function saveNewHighscore(req, next){
	
	var trackkey = req.body.trackkey;
	var facebookID  = req.body.fb_id;
	var score     = req.body.score;
	var precisestarrating = req.body.precisestarrating;
	var xpRewarded = xpCalculator(req.body.difficulty, precisestarrating);
	var starrating = req.body.starrating;
	
	
	//We don't need to check any of the variables as we already have previously.
	async.parallel([
		function (callback) {
			//We need this so that we can both and the reference to the score document and increment the track play
			return Track.findOne({trackkey: trackkey}).exec(callback);
		},
		function (callback) {
			//We need this so that we can add the user reference to the score document.
			return User.findOne({fb_id: facebookID}).exec(callback);
		},
		function (callback) {
 			//This finds all the scores greater or equal to the one that we're posting. used for ranking
 			return Score.find({trackkey:trackkey, score:{$gte:score}}).lean().exec(callback);
 		}
	], function (err, results) {

		var track = results[0];
		var user = results[1];
		var scoresGreaterOrEqualToThisScore = results[2];

		if (track && user && scoresGreaterOrEqualToThisScore) {
			console.log("Saving new score.");
			var scoreObj = new Score({trackId: track._id, userId : user._id, score  : score, trackkey : track.trackkey, starrating: starrating})
			.save(function (err, score) {
				if (err) {
					next('error');
				}
				else {
					user.tracks.push(track.trackkey);
					user.xp = user.xp + xpRewarded;
					user.save();
					console.log("Saved new score.");
					score.xpRewarded = xpRewarded;
					score.rank = scoresGreaterOrEqualToThisScore.length+1;
					incrementTrack(track);
					next(null, score);
				}
			});
			scoreObj;//I've put this here because i get the stupid "scoreObj" may not be used warning message - which is FUCKING ANNOYING
		}
		else {
			if(!track){
				console.log("Something happened getting track data whilst trying to post a new score");	
			}
			if(!user){
				console.log("Something happened getting user data whilst trying to post a new score");	
			}
			if(!scoresGreaterOrEqualToThisScore){
				console.log("Something happened getting ranking data whilst trying to post a new score");	
			}
			next('error');
		}
	});
}

//--------------------------------------------
//GET TRACK
//QUERIES FOR EXISTING TRACKS BASED ON USERNAME
//--------------------------------------------
function getExistingTrack(trackkey, callback) {

 var promise = new mongoose.Promise;
 if (callback) promise.addBack(callback);

 Track.findOne({trackkey: trackkey})//find a track
   .exec(function (err, track) {
       if (err) {
           promise.error(err);//if error reject promise
       }
       else if (track) {//if track, increment by one
           promise.complete(track);
       }
       else {
           promise.complete(null);//if no track return 0;
       }


   });

 return promise;
}

//--------------------------------------------
//SAVE NEW TRACK
//SAVES A BRAND NEW TRACK OBJECT
//--------------------------------------------
function saveNewTrack(attributes, callback) {
 var promise = new mongoose.Promise;
 if (callback) promise.addBack(callback);

 var track = new Track({ //else generate a new track object
     trackname: attributes.trackname,
     artist   : attributes.artist,
     trackkey : attributes.trackkey,
     difficulty : attributes.difficulty
 });
 track.save(function (err, track) {// and save it!
     if (err) {
         promise.error(err);
     }
     else if (track) {
         promise.complete(track); //send the resulting track
     }
     else {
         promise.complete(null); //send the resulting track
     }
 });

 return promise;
}

//--------------------------------------------
//INCREMENT TRACK
//INCREASES A TRACKS PLAYS VALUE BY ONE
//--------------------------------------------
function incrementTrack(track) {
	console.log("Incrementing track play for: " + track.trackkey);
	track.plays = track.plays += 1;
	track.save();
}
