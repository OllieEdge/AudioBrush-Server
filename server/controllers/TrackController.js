var mongoose = require('mongoose');
var Track = mongoose.model('Track');
var User = mongoose.model('User');

var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');

module.exports = {

    createTrack: function (req, res) {

        console.log('CREATE TRACK');

        var trackname = sanitise.getTrackName(req);
        var artist = sanitise.getArtistName(req);
        var trackkey = sanitise.trackkey(req.params.trackkey);

        console.log('---------------------');
        console.log(artist, trackname);
        console.log('---------------------');

        if (artist && trackname && trackkey) {//if both artist and track exist from the request

            getExistingTrack(trackkey)
              .then(function (track) { //CHECK FOR EXISTING TRACK
                  if (track) {//if one exists return it
                      res.send(200, track);
                  }
                  else {//else save a new track
                      return saveNewTrack({ trackname: trackname, artist: artist , trackkey: trackkey});
                  }

              })
              .then(function (track) {//when the new track is saved
                  if (track) {//return track
                      res.send(200, track);
                  }
                  else {
                      error('no track', res);
                  }
              });
            /*.error(function (err) {
             //figure out mongoose promise errors
             res.send(400, err);
             })*/
        }
        else {
            error('NO TRACKNAME OR ARTIST', res);
        }
    },

    searchTracks: function (req, res) {
    	var searchCriteria = sanitise.search(req.params.search);
    	var re = new RegExp(searchCriteria, 'i');
    	
    	Track
    		.find()
    		.where('trackkey')//NEED TO ADD TRACK NAME TOO, BUT I HAVE NO IDEA HOW TO DO THIS...OLLIE.
    		.regex(re)
    		.exec(function (err, tracks){
    			if(err){
    				error("No tracks found");
    			}
    			else if(tracks){
    				res.send(200, tracks);
    			}
    			else{
    				error("No tracks found");
    			}
    		});
    },
    
    getTrack: function (req, res) {
    	var trackkey = sanitise.trackkey(req.params.trackkey);

        getExistingTrack(trackkey)
          .then(function (track) {
              if (track) {
                  res.send(200, track);
              }
              else {
                  error('no track brah');
                  res.send(200, {});
              }
          });
    },
    
    getLatestTracks : function (req, res){

    	var re = new RegExp("tournament_", 'i');
    	
    	Track
    	.find({trackkey : {$not : re } } )
		.limit(50)
		.sort('-last_update')
		.exec(function (err, tracks){
			if(err){
				error("No tracks found");
			}
			else if(tracks){
				res.send(200, tracks);
			}
			else{
				error("No tracks found");
			}
		});
    },
    
    getPopularTracks : function (req, res){
    	
    	var re = new RegExp("tournament_", 'i');
    	
    	Track
    	.find({trackkey : {$not : re } } )
		.limit(50)
		.sort('-plays')
		.exec(function (err, tracks){
			if(err){
				error("No tracks found");
			}
			else if(tracks){
				res.send(200, tracks);
			}
			else{
				error("No tracks found");
			}
		});
    },

    getTrackList: function (req, res) {

        var trackname = sanitise.getTrackName(req);
        var filters = {
            trackname: (req.body.trackname ? req.body.trackname += '' : null),
            artist: (req.body.artist ? req.body.artist += '' : null),
            limit : (req.body.limit ? req.body.limit += '' : 10),
            sorter: '-plays'
        };


        getTrackList(trackname, filters)
          .then(function (trackList) {
              res.send(200, trackList);
          });
    },
    
    getFriendTracks: function (req, res) {
    	
    	var friendFacebookIDs = sanitise.facebookIDs(req.body.friends);
    	
    	if(friendFacebookIDs){
    		var tracks = new Array();
    		
    		User
    			.find({fb_id : {$in : friendFacebookIDs}})
    			.lean()
    			.exec( function (err, users){
    				if(err){
    					console.log("There was a problem trying to get the friends of the user");
    				}
    				else if(users){
    					console.log("Filtering tracks from users friends");
    					for(var i = 0; i < users.length;i++){
        					for(var t = 0; t < users[i].tracks.length; t++){
        						if(tracks.indexOf(users[i].tracks[t] < 0)){
        							if(users[i].tracks[t].indexOf("tournament_") == -1){
        								tracks.push(users[i].tracks[t]);
        							}
        						}
        					}
        				}
    					
    					Track
    	    			.find({trackkey: {$in : tracks}})
    	    			.lean()
    	    			.exec( function(err, tracksFound){
    	    				if(err){
    	    					console.log("There was an issue populating the tracks from the users friends");
    	    				}
    	    				else if(tracksFound){
    	    					res.send(200, tracksFound);
    	    				}
    	    				else{
    	    					console.log("There was an issue populating the tracks from the users friends");
    	    				}
    	    			});
    					
    				}
    				else{
    					console.log("There was a problem trying to get the friends of the user");
    				}
    			});
    	}
    	
    },
    
    deleteAllTracks : function (req, res){
		Track.find()
		.exec(function (err, tracks) {
			if (err) {
				error(err, res);
			}
			else if (tracks) {
				var i = tracks.length;
				while (i--) {
					tracks[i].remove();
				}
				res.send(200, {});
			}
		});
	},

    updateTrack:function(req, res){}, //not needed right now
    deleteTrack:function(req, res){}  //not needed right now
};

// --------------------------------------------
// GET TRACKS
// QUERIES FOR EXISTING TRACKS BASED ON USERNAME
// --------------------------------------------
function getTrackList(trackname, filters, callback) {

    var promise = new mongoose.Promise;
    if (callback) promise.addBack(callback);

    var que;
    
    if (filters && filters.trackname){
        que = Track.find({trackname: filters.trackname});//find a tracklist
    }
    else{
        que = Track.find();//find a tracklist
    }

    if (filters && filters.artist) { //if a filter for artist exists
        que.where('artist').equals(filters.artist);
    }
    if (filters && filters.sorter) { //if a sorter for artist exists
        que.sort(filters.sorter);
    }
    if (filters && filters.limit) { //if a limit
        que.limit(filters.limit);
    }

    que.lean();
    que.exec(function (err, tracks) {

        if (err) {
            promise.error(err);//if error reject promise
        }
        else if (tracks) {//if track, increment by one
            promise.complete(tracks);
        }
        else {
            promise.complete(null);//if no track return 0;
        }
    });

    return promise;
}


// --------------------------------------------
// GET TRACK
// QUERIES FOR EXISTING TRACKS BASED ON USERNAME
// --------------------------------------------
function getExistingTrack(trackkey, callback) {

    console.log('GET EXISTING TRACK');

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

// --------------------------------------------
// SAVE NEW TRACK
// SAVES A BRAND NEW TRACK OBJECT
// --------------------------------------------
function saveNewTrack(attributes, callback) {
    var promise = new mongoose.Promise;
    if (callback) promise.addBack(callback);

    var track = new Track({ //else generate a new track object
        trackname: attributes.trackname,
        artist   : attributes.artist,
        trackkey : attributes.trackkey
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

// --------------------------------------------
// INCREMENT TRACK
// INCREASES A TRACKS PLAYS VALUE BY ONE
// --------------------------------------------
function incrementTrack(track) {
    track.plays = track.plays += 1;
    track.save();
}