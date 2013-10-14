
var mongoose = require('mongoose');
var Gift = mongoose.model('Gift');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Achievement = mongoose.model('Achievement');

var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');

module.exports = {
		
	//Administrator purposes only
   getAllAchievements : function (req, res){
		Achievement.find()
		.lean()
		.exec(function (err, achievments) {
			if (err) {
				error(err, res);
			}
			else if (achievments) {
				res.send(200, achievments);
			}
		});
    },
    
    
	getAllAchievementsForUser : function (req, res){
	    	
    	var userID = req.params.userid;
    	
    	//This point we can check if the gift is still valid, and if it's not
    	//We can then remove it before it gets sent to the client.
		Achievement.find({'owner':userID})
		.lean()
		.exec(function (err, achievements) {
			if (err) {
				error(err, res);
			}
			else if (achievements) {
				res.send(200, achievements);
			}
		});
    },
		
		
    //  CREATE & UPDATE AN ACHIEVEMENT
    //  ------------------------
    updateAchievement : function (req, res){
    	//returns a score if there was a previous score to update.
		_updatePreviousAchievement.call(this, req, function(err, achievement){
			if(err){
				error('', res);
			}
			else if (achievement) {
				res.send(200, achievement);
			}
			else if (achievement == null) {
				//this needs to be more dry
				_setupNewAchievement.call(this, req, function (err, achievement) {
					if (err) {
						error('', res);
					}
					else if (achievement) {
						res.send(200, achievement);
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
    
    //Administrator purposes only
    deleteAllAchievements : function (req, res){
		Achievement.find()
		.exec(function (err, achievements) {
			if (err) {
				error(err, res);
			}
			else if (achievements) {
				var i = achievements.length;
				while (i--) {
					achievements[i].remove();
				}
				res.send(200, {});
			}
		});
    }
};

function _updatePreviousAchievement(req, next){
	
	var userID  = req.body.userID;
	var achievementID = req.body.achievementID;
	var progress = req.body.progress;
	
	 if (!achievementID || !progress || !userID) {
		console.log("Missing update achievement parameters, params required: achievementID, progress, userID");
		next('error');
		return;
	 }
	 
	 Achievement.findOne({achievementID:achievementID, owner:userID})
	 .exec(function (err, results) {
		 if(err){
			 console.log("There was an error attempting to find the existing achievement");
			 console.log(err.text);
			 next(null, null);
		 }
		 else if(results){
			 if(results.completed != null){
				 console.log("user has already done this achievement, skipping...");
				 next(null, results);
			 }
			 else{
				 results.updated = new Date();
				 results.progress = progress;
				 if(progress == 100){
					 console.log("Achievement completed, now gifting user the rewards");
					 results.completed = new Date();
					 results = giftUserAchievementReward(results, userID);
				 }
				 results.save();
				 console.log("Achievement was found and updated.");
				 next(null, results);
		 	}
		 }
		 else{
			 console.log("Achievement doesn't exist yet, going to create a new one now.");
			 next(null, null);
		 }
	 });
	
}

function _setupNewAchievement(req, next){
	var userID  = req.body.userID;
	var achievementID = req.body.achievementID;
	var progress = req.body.progress;
	
	 if (!achievementID || !progress || !userID) {
		console.log("Missing update achievement parameters, params required: achievementID, progress, userID");
		next('error');
		return;
	 }
	 
	 var achievement = new Achievement({achievementID:achievementID, owner:userID, progress:progress, updated:new Date()});
	 achievement = populateAchievementRewards(achievement);
	 if(achievement.progress == 100){
		 achievement.completed = new Date();
		 achievement = giftUserAchievementReward(achievement, userID);
	 }
	 
	 achievement.save(function (err, achieve) {
		if (err) {
			console.log("There was an error attempting to save the Achievement");
			console.log(err.text);
			next('error');
		}
		else {
			console.log("A new achievement was successfully created and saved");
			next(null, achieve);
		}
	});
	 
}

function populateAchievementRewards(achievement){
	var achievementID = parseInt(achievement.achievementID);
	switch(achievementID){
	case 1:
		achievement.credits = 3;
		break;
	case 2:
		achievement.credits = 5;	
		break;
	case 3:
		achievement.credits = 7;
		break;
	case 4:
		achievement.credits = 0;
		break;
	case 5:
		achievement.credits = 2;
		break;
	case 6:
		achievement.credits = 7;
		break;
	case 7:
		achievement.credits = 15;
		break;
	case 8:
		achievement.credits = 50;
		break;
	case 9:
		achievement.credits = 3;
		break;
	case 10:
		achievement.credits = 10;
		break;
	case 11:
		achievement.credits = 50;
		break;
	case 12:
		achievement.credits = 2;
		break;
	case 13:
		achievement.credits = 2;
		break;
	case 14:
		achievement.credits = 5;
		break;
	case 15:
		achievement.credits = 5;
		break;
	case 16:
		achievement.credits = 5;
		break;
	case 17:
		achievement.credits = 30;
		break;
	case 18:
		achievement.credits = 5;
		break;
	case 19:
		achievement.credits = 3;
		break;
	case 20:
		achievement.credits = 5;
		break;
	case 21:
		achievement.credits = 5;
		break;
	case 22:
		achievement.credits = 0;
		break;
	}
	return achievement;
}

function giftUserAchievementReward(achievement, userID){
	sendGift(userID, achievement.credits, achievement.reward, 1, achievement.achievementID);
	return achievement;
}

function sendGift(userID, credits, product, productQuantity, achievementID){
	
	if(credits > 0 || products != null){
		//Make sure that we have everything we need.
	    if (userID) {
	    	
	    	//This is so that we can identify the reward giver in the client
	    	var from = "achievement_"+achievementID;
			
			var today = new Date();
			var expiry = new Date();
			expiry.setDate(today.getDate() + 100);
			
			var gift = new Gift({
					to:userID,
					admin:from,
					sent:today,
					expires:expiry,
					credits:credits,
					productID:product,
					productQuantity:productQuantity});
			gift.save();
			console.log("Successfully gifted user achievement reward.");
	    }
	}
	else{
		console.log("Achievement has no rewards, skipped auto gift.");
	}
	
}


