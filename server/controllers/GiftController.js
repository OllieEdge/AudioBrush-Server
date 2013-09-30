
var mongoose = require('mongoose');
var Gift = mongoose.model('Gift');
var User = mongoose.model('User');
var Product = mongoose.model('Product');

var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');

var sendNotificationTo = require('../utils/sendNotificationTo');

var GIFT_LIFESPAN_DAYS = 5;
var MAXIMUM_CREDITS_ALLOWED = 5;

module.exports = {
    //  CREATE PRODUCT
    //  ------------------------
    sendGift: function (req, res) {
    	
    	var receivers = req.body.to;//this can be many people
    	var senderFB_ID = req.body.from;
    	var credits = req.body.credits; //we need to make sure this value hasn't been altered
    	var product = req.body.productID;
    	var productQuantity = req.body.productQuantity;
    	
    	//For some reason when sending a single value in an array 
    	//from flash it disregards the array and sends the single value.
    	//We need to make sure that receivers is an array first
    	if(typeof receivers == "string"){
    		receivers = new Array();
    		receivers.push(req.body.to);
    	}
    	
    	//Parse all this data to be processed and responded
    	sendGifts(receivers, senderFB_ID, credits, product, productQuantity, req, res);
    },
   
    getAllGiftsForUser : function (req, res){
    	
    	var userID = req.params.userid;
    	var today = new Date();
    	
    	//This point we can check if the gift is still valid, and if it's not
    	//We can then remove it before it gets sent to the client.
		Gift.find({'to':userID})
		.populate('from')
		.exec(function (err, gifts) {
			if (err) {
				error(err, res);
			}
			else if (gifts) {
				var i = gifts.length;
				while(i--){
					if(gifts[i].expires < today){
						gifts[i].remove();
					}
				}
				res.send(200, gifts);
			}
		});
    },
    
    //Admin purposes only
    getAllGifts : function (req, res){
		Gift.find()
		.exec(function (err, gifts) {
			if (err) {
				error(err, res);
			}
			else if (gifts) {
				res.send(200, gifts);
			}
		});
    },
    
    //When a user send another user a free gift they have the option to return
    //the favour. This can handle a load or just one at a time
    acceptAndSendGift : function (req, res){
    	
    	//Array of gift ids - the client will only ever send a maximum of 10 at a time
    	var giftID = req.body.giftids;
    	
    	if(giftID == null){
    		res.send(501, "There was a problem with the giftids parsed");
    		return;
    	}
    	
    	//For some reason when sending a single value in an array 
    	//from flash it disregards the array and sends the single value.
    	//We need to make sure that giftID is an array first
    	if(typeof giftID == "string"){
    		giftID = new Array();
    		giftID.push(req.body.giftids);
    	}
    	
    	//Let's get the date so we don't have to do it in a loop later
    	var today = new Date();
		var expiry = new Date();
		expiry.setDate(today.getDate() + GIFT_LIFESPAN_DAYS);
		
		//Get the amount of credits that we MAY send ready.
		var credits = Math.ceil(Math.random()*3);
    	
		//Get the gifts that are in the giftID array
		Gift.find({'_id':{$in : giftID}})
		.populate('to')
		.populate('from')
		.exec(function (err, gifts) {
			if (err) {
				console.log("there was a problem getting the gifts");
				error(err, res);
			}
			else if (gifts) {
				var i = gifts.length;
				//Store the total amount of credits received so we can add it later to the user.
				var creditsAwarded = 0;
				//Same for the products and their quantities
				var products = new Array();
				var productsQuantity = new Array();
				
				//Store the ID of the user so we can grab it later
				var userID = gifts[0].to._id;
				//We'll need this for the products if there are any
				var facebookID = gifts[0].to.fb_id;
				while(i--){
					
					
					//Let's send the gift back, so we need to switch around the to/from properties.
					//This is where we can update Push Notifications "gifts[i].from.airship_token"
					//contains the token of the new receipient
					var gift = new Gift(
							{to:gifts[i].from._id,
							from:gifts[i].to._id,
							sent:today,
							expires:expiry,
							credits:credits});
					gift.save();
					
					sendNotificationTo({
	        			"alert": gifts[i].to.username + " has sent you a gift! Login now to claim and thank your buddy.",
	        			"badge": 1
	        		}, gifts[i].from.airship_token);
					
					//Add the credits to the total awarded
					if(gifts[i].credits > 0){
						creditsAwarded += gifts[i].credits;
					}
					else{
						//If there are no credit on the gift that means that there MUST
						//be products on it, so let's deal with those
						products.push(gifts[i].productID);
						productsQuantity.push(gifts[i].productQuantity);
					}
					//Now that the gift is spent, we remove it.
					gifts[i].remove();
				}
				
				//If there are any product let's add them to the database
				if(products.length > 0){
					for(var p = 0; p < products.length; p++){
						var product = new Product({
							productID:products[i],
							fb_id:facebookID,
							quantity:productsQuantity[i]
						});
						product.save();
					}
				}
				
				//If there are any credits, let's update the user.
				if(creditsAwarded > 0){
					User.findOne({'_id':userID})
					.exec(function (err, user){
						user.credits = user.credits + creditsAwarded;
						user.save();
						res.send(200, user);
					});
				}
				
				
			}
		});
    },
    
    //Admin purposes only
    deleteAllGifts : function (req, res){
		Gift.find()
		.exec(function (err, gifts) {
			if (err) {
				error(err, res);
			}
			else if (gifts) {
				var i = gifts.length;
				while (i--) {
					gifts[i].remove();
				}
				res.send(200, {});
			}
		});
    }
};

function sendGifts(receivers, senderFB_ID, credits, product, productQuantity, req, res){
	
	//Make sure they are not jipping the system. Because if they are - fuck you.
	if(credits && credits <= MAXIMUM_CREDITS_ALLOWED){
		credits = Math.ceil(Math.random()*3);
	}
	else{
		credits = 0;
		if(product || product == ""){
			//There is nothing to do.
			res.send(200, {});
			return;
		}
	}
	
	
	//Make sure that we have everything we need.
    if (receivers && senderFB_ID && credits && product != null && productQuantity != null) {
    	
    	
    	var gifts = new Array();
    	
    	//First we get the send details from the parsed facebookID
    	User
		.find({fb_id : senderFB_ID})
		.select('_id')
		.lean()
		.exec( function (err, sender){
			if(err){
				console.log("501: There was a problem getting the sender details");
				res.send(501, "There was a problem getting the sender details");
			}
			else if(sender){
				
				//Then we need to get all of the receipients from the parsed array
				User
				.find({fb_id : {$in : receivers}})
				.select('_id airship_token')
				.lean()
				.exec( function (err, users){
					if(err){
						console.log("There was a problem getting the receipient details");
						res.send(501, "There was a problem getting the receipient details");
					}
					else if(users){
						
						var today = new Date();
						var expiry = new Date();
						expiry.setDate(today.getDate() + GIFT_LIFESPAN_DAYS);
						
						//This is where we can send the Push Notifications
						//users[i].airship_token will contain the relevant info
						for(var i = 0; i < users.length; i++){
			        		var gift = new Gift({
			        			to:users[i]._id,
			        			from:sender[0]._id,
			        			sent:today,
			        			expires:expiry,
			        			credits:credits,
			        			productID:product,
			        			productQuantity:productQuantity});
			        		gift.save();
			        		gifts.push(gift);
			        		sendNotificationTo({
			        			"alert": sender[0].username + " has sent you a gift! Login now to claim and thank your buddy.",
			        			"badge": 1
			        		}, users[i].airship_token);
			        	}
						
						res.send(200, gifts);
					}
					else{
						console.log("501: There was a problem getting the receipient details");
						res.send(501, "There was a problem getting the receipient details");
					}
				
				});
				
			}
			else{
				console.log("501: There was a problem getting the sender details");
				res.send(501, "There was a problem getting the sender details");
			}
		});
    	
    	
    }
	
}