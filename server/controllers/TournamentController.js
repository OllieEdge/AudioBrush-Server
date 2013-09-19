// --- db ---
var mongoose = require('mongoose');
var Score = mongoose.model('Score');
var Tournament = mongoose.model('Tournament');
var TournamentData = mongoose.model('TournamentData');

//--- db tools ---
var unique = require('../db/lib/GetUniqueResource');

// --- controllers ---
var ScoreController = require('./ScoreController');

//--- utils ---
var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');


// --- api ---
module.exports = {
		getTournamentLeader: function (req, res) {
	
			var tournamentID = req.params.tournamentid;
			
			if(tournamentID){
			
				Score
					.findOne({trackkey:"tournament_" + tournamentID})
					.sort('-score')
					.populate('userId')
					.lean()
					.exec(function (err, score){
						if(err){
							console.log("There was a problem getting the leader of a tournament.");
							console.log(err.message);
						}
						else if(score){	
							console.log("Retrieved leader of tournament.");
							res.send(200, score);
						}
						else if(score == null){
							console.log("No scores set for this tournament");
							res.send(200, {});
						}
						else{
							console.log("There was a problem getting the leader of a tournament.");
							console.log(err.message);
						}
					});
			}
		}
};