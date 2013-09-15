var mongoose = require('mongoose');
var Track = mongoose.model('Track');

var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');

module.exports = {

    createTrack: function (req, res) {

        console.log('CREATE TRACK')

        var trackname = sanitise.getTrackName(req)
        var artist = sanitise.getArtistName(req)

        console.log('---------------------')
        console.log(artist, trackname)
        console.log('---------------------')

        if (artist && trackname) {//if both artist and track exist from the request

            getExistingTrack(trackname)
              .then(function (track) { //CHECK FOR EXISTING TRACK
                  if (track) {//if one exists return it
                      res.send(200, track);
                  }
                  else {//else save a new track
                      return saveNewTrack({ trackname: trackname, artist: artist });
                  }

              })
              .then(function (track) {//when the new track is saved
                  if (track) {//return track
                      res.send(200, track);
                  }
                  else {
                      error('no track', res)
                  }
              })
            /*.error(function (err) {
             //figure out mongoose promise errors
             res.send(400, err);
             })*/
        }
        else {
            error('NO TRACKNAME OR ARTIST', res);
        }
    },

    getTrack: function (req, res) {
        var trackname = sanitise.getTrackName(req)

        getExistingTrack(trackname)
          .then(function (track) {
              if (track) {
                  res.send(200, track);
              }
              else {
                  error('no track brah');
                  res.send(200, {})
              }
          })
    },

    getTrackList: function (req, res) {

        var trackname = sanitise.getTrackName(req)
        var filters = {
            trackname: (req.body.trackname ? req.body.trackname += '' : null),
            artist: (req.body.artist ? req.body.artist += '' : null),
            limit : (req.body.limit ? req.body.limit += '' : 10),
            sorter: '-plays'
        }


        getTrackList(trackname, filters)
          .then(function (trackList) {
              res.send(200, trackList);
          })
    },

    updateTrack:function(req, res){}, //not needed right now
    deleteTrack:function(req, res){}  //not needed right now
}

// --------------------------------------------
// GET TRACKS
// QUERIES FOR EXISTING TRACKS BASED ON USERNAME
// --------------------------------------------
function getTrackList(trackname, filters, callback) {

    var promise = new mongoose.Promise;
    if (callback) promise.addBack(callback);

    if (filters && filters.trackname){
        var que = Track.find({trackname: filters.trackname})//find a tracklist
    }
    else{
        var que = Track.find()//find a tracklist
    }

    if (filters && filters.artist) { //if a filter for artist exists
        que.where('artist').equals(filters.artist);
    }
    if (filters && filters.sorter) { //if a sorter for artist exists
        que.sort(filters.sorter)
    }
    if (filters && filters.limit) { //if a limit
        que.limit(filters.limit)
    }

    que.lean();
    que.exec(function (err, tracks) {

        if (err) {
            promise.error(err);//if error reject promise
        }
        else if (tracks) {//if track, increment by one
            promise.complete(tracks)
        }
        else {
            promise.complete(null)//if no track return 0;
        }
    })

    return promise;
}


// --------------------------------------------
// GET TRACK
// QUERIES FOR EXISTING TRACKS BASED ON USERNAME
// --------------------------------------------
function getExistingTrack(trackname, callback) {

    console.log('GET EXISTING TRACK')

    var promise = new mongoose.Promise;
    if (callback) promise.addBack(callback);

    Track.findOne({trackname: trackname})//find a track
      .exec(function (err, track) {
          if (err) {
              promise.error(err);//if error reject promise
          }
          else if (track) {//if track, increment by one
              incrementTrack(track);
              promise.complete(track)
          }
          else {
              promise.complete(null)//if no track return 0;
          }


      })

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
        artist   : attributes.artist
    })
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
    })

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