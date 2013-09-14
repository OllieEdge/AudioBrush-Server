/*
 *   THIS NO LONGER WORKS, FIX IT
 * */
var UserController = require('../controllers/UserController');
var TrackController = require('../controllers/TrackController');
var ScoreController = require('../controllers/ScoreController');
var TournamentController = require('../controllers/TournamentController');

var routes = {
	// --- USERS ---
	'/api/v1/user/:username': {
		method    : 'put',
		controller: UserController,
		action    : 'createUser'
	},

	'/api/v1/user/:username': {
		method    : 'get',
		controller: UserController,
		action    : 'readUser'
	},

	'/api/v1/user/:username': {
		method    : 'post',
		controller: UserController,
		action    : 'updateUser'
	},

	'/api/v1/user/:username': {
		method    : 'del',
		controller: UserController,
		action    : 'delUser'
	},

	'/api/v1/users/'            : {
		method    : 'get',
		controller: UserController,
		action    : 'readUsers'
	},

	// --- TRACKS ---
	'/api/v1/track/:trackName': {
		method    : 'put',
		controller: TrackController,
		action    : 'createTrack'
	},

	'/api/v1/track/:trackName': {
		method    : 'get',
		controller: TrackController,
		action    : 'getTrack'
	},

	'/api/v1/track/:trackName': {
		method    : 'post',
		controller: TrackController,
		action    : 'updateTrack'
	},

	'/api/v1/tracks/'  : {
		method    : 'get',
		controller: TrackController,
		action    : 'getTrackList'
	},

	// --- SCORES ---
	'/api/v1/score/': {
		method    : 'put',
		controller: ScoreController,
		action    : 'createScore'
	},

	'/api/v1/scores/'                     : {
		method    : 'get',
		controller: ScoreController,
		action    : 'getScores'
	},

	// --- Tournaments ---
	'/api/v1/tournament/:tournamentName': {
		method    : 'put',
		controller: TournamentController,
		action    : 'createTournament'
	}
}


var setup = function(){
    for (var route in routes) {

        var attrs = routes[route];
        var method = attrs.method;
        var controller = attrs.controller;
        var action = controller[attrs.action];

        if (!method || !controller || !action) return;
        app[method](route, action);
    }
}


module.exports = function (app) {
    setup: setup
};