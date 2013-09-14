/*
 *   THIS NO LONGER WORKS, FIX IT
 * */
var UserController = require('../controllers/UserController');
var TrackController = require('../controllers/TrackController');
var ScoreController = require('../controllers/ScoreController');
var TournamentController = require('../controllers/TournamentController');

var routes = {
	// --- USERS ---
	'/user/create/:username': {
		method    : 'post',
		controller: UserController,
		action    : 'createUser'
	},

	'/user/read/:username': {
		method    : 'get',
		controller: UserController,
		action    : 'readUser'
	},

	'/user/update/:username': {
		method    : 'post',
		controller: UserController,
		action    : 'updateUser'
	},

	'/user/delete/:username': {
		method    : 'post',
		controller: UserController,
		action    : 'deleteUser'
	},

	'/users/read/'            : {
		method    : 'get',
		controller: UserController,
		action    : 'readUsers'
	},

	// --- TRACKS ---
	'/track/create/:trackName': {
		method    : 'post',
		controller: TrackController,
		action    : 'createTrack'
	},

	'/track/read/:trackName': {
		method    : 'get',
		controller: TrackController,
		action    : 'getTrack'
	},

	'/track/update/:trackName': {
		method    : 'post',
		controller: TrackController,
		action    : 'updateTrack'
	},

	'/tracks/get/'  : {
		method    : 'get',
		controller: TrackController,
		action    : 'getTrackList'
	},

	// --- SCORES ---
	'/score/create/': {
		method    : 'post',
		controller: ScoreController,
		action    : 'createScore'
	},

	'/scores/read/'                     : {
		method    : 'get',
		controller: ScoreController,
		action    : 'getScores'
	},

	// --- Tournaments ---
	'/tournament/create/:tournamentName': {
		method    : 'post',
		controller: TournamentController,
		action    : 'createTournament'
	}
}

module.exports = function (app) {
	for (var route in routes) {

		var attrs = routes[route];
		var method = attrs.method;
		var controller = attrs.controller;
		var action = controller[attrs.action];

		if (!method || !controller || !action) return;
		app[method](route, action);
	}
};

