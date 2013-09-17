// --- db ---
var mongoose = require('mongoose');
var Tournament = mongoose.model('Tournament');

//--- db tools ---
var unique = require('../db/lib/GetUniqueResource');

// --- controllers ---
var ScoreController = require('./ScoreController');

//--- utils ---
var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');


// --- api ---
module.exports = {
	createTournament: function (req, res) {
		console.log('boo yah');

		ScoreController.getNewScore(req, function(err, score){
			if(err) error(err, res);
			else if(score){
				console.log(score);
			}
		});

		res.send(200, {});

		/*unique('Tournament', {}, function(){
		 console.log('result', arguments)
		 }).then(function (tournament) {
		 console.log('-----------------');
		 console.log(tournament);
		 console.log('-----------------');

		 res.send(200, tournament);
		 })*/
	}
};