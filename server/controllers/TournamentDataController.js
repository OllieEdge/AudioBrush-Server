
var mongoose = require('mongoose');
var TournamentData = mongoose.model('TournamentData');

var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');

var sendNotificationToAll = require('../utils/sendNotificationToAll');

module.exports = {
    //  CREATE PRODUCT
    //  ------------------------
    createTournament: function (req, res) {

    	var startDate = new Date(parseFloat(req.body.activeDate));
    	var endDate = new Date();
    	endDate.setDate(startDate.getDate()+parseInt(req.body.duration));
    	
    	data = new TournamentData({
    			tournamentID:req.body.tournamentID,
    			activeDate:startDate,
    			endDate:endDate,
    			cost:req.body.cost,
    			prizes:req.body.prizes,
    			track:req.body.track,
    			artist:req.body.artist,
    			artworkURL:req.body.artworkURL,
    			trackURL:req.body.trackURL,
    			beatsFile:req.body.beatsFile,
    			beatsDetectedFile:req.body.beatsDetectedFile,
    			starBeatsFile:req.body.starBeatsFile,
    			fluxFile:req.body.fluxFile,
    			sectionsFile:req.body.sectionsFile,
    			starSectionsFile:req.body.starSectionsFile
    	})
    		.save(function (err, tournament){
	    		if(err){
	    			console.log("There was a problem when creating the tournament in the database");
	    			console.log(err.message);
	    		}
	    		else if(tournament){
	    			res.send(200, tournament);
				    sendNotifcationToAll()
	    		}
	    		else{
	    			console.log("There was a problem when creating the tournament in the database");
	    		}
	    	});
    },
    
    getActiveTournaments : function (req, res) {
    	
    	var today = new Date();
    	
    	TournamentData
    		.find()
    		.lean()
    		.where('activeDate').lt(today)
    		.where('endDate').gt(today)
    		.exec( function (err, tournaments){
    			if(err){
    				console.log("There was a problem when get the tournaments in the database");
	    			console.log(err.message);
    			}
    			else if(tournaments){
    				res.send(200, tournaments);
    			}
    			else{
    				
    			}
    		});
    },
    
	 getAllTournaments : function (req, res) {
	    	
	    	TournamentData
	    		.find()
	    		.lean()
	    		.exec( function (err, tournaments){
	    			if(err){
	    				console.log("There was a problem when get the tournaments in the database");
		    			console.log(err.message);
	    			}
	    			else if(tournaments){
	    				res.send(200, tournaments);
	    			}
	    			else{
	    				
	    			}
	    		});
	    },
    
    deleteTournament: function (req, res) {

    	var tournamentID = req.params.tournamentid;
    	
    	TournamentData
    		.findOne({tournamentID:tournamentID})
    		.exec( function (err, tournament){
    			if(err){
    				console.log("There was a problem when deleting the tournament in the database");
	    			console.log(err.message);
    			}
    			else if(tournament){
    				tournament.remove();
    				res.send(200, {});
    			}
    			else{
    				
    			}
    		});
    }
};