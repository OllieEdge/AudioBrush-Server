var mongoose = require('mongoose');


var easyXP = [0, 20, 50, 100, 200, 300];
var normalXP = [0, 50, 100, 200, 300, 500];
var hardXP = [0, 100, 200, 300, 500, 1000];
var expertXP = [0, 200, 300, 500, 1000, 4000];
var insaneXP = [0, 300, 500, 1000, 4000, 10000];

var currentXPPromotionMultiplier = 1;

module.exports = function(_difficulty, _starRating){

	var xpRewarded = 0;
	
	var difficulty = parseInt(_difficulty);
	var starRating = parseFloat(_starRating);

	switch(difficulty){
	case 1:
		xpRewarded = easyXP[Math.floor(starRating)] + ((easyXP[Math.ceil(starRating)] - easyXP[Math.floor(starRating)]) * (starRating - Math.floor(starRating)));
		break;
	case 2:
		xpRewarded = normalXP[Math.floor(starRating)] + ((normalXP[Math.ceil(starRating)] - normalXP[Math.floor(starRating)]) * (starRating - Math.floor(starRating)));
		break;
	case 3:
		xpRewarded = hardXP[Math.floor(starRating)] + ((hardXP[Math.ceil(starRating)] - hardXP[Math.floor(starRating)]) * (starRating - Math.floor(starRating)));
		break;
	case 4:
		xpRewarded = expertXP[Math.floor(starRating)] + ((expertXP[Math.ceil(starRating)] - expertXP[Math.floor(starRating)]) * (starRating - Math.floor(starRating)));
		break;
	case 5:
		xpRewarded = insaneXP[Math.floor(starRating)] + ((insaneXP[Math.ceil(starRating)] - insaneXP[Math.floor(starRating)]) * (starRating - Math.floor(starRating)));
		break;
	}

	console.log("XP Rewarded: "+ xpRewarded);
	return Math.round(xpRewarded) * currentXPPromotionMultiplier;
	
};