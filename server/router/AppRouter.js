/*
 *   THIS NO LONGER WORKS, FIX IT
 * */
var UserController = require('../controllers/UserController');
var TrackController = require('../controllers/TrackController');
var ScoreController = require('../controllers/ScoreController');
var TournamentController = require('../controllers/TournamentController');

var routes = {
    // --- USERS ---
    // --- TRACKS ---
    // --- SCORES ---

    '/api/v1/score/': {
        method: 'put',
        controller: ScoreController,
        action: 'createScore'
    },

    '/api/v1/scores/': {
        method: 'get',
        controller: ScoreController,
        action: 'getScores'
    },

    // --- Tournaments ---
    '/api/v1/tournament/:tournamentName': {
        method: 'put',
        controller: TournamentController,
        action: 'createTournament'
    }
}

var applicationRoutes = [

    // ------------------------------------
    // ------------- USERS ----------------
    // ------------------------------------

    //CREATE USER
    {
        route: '/api/v1/user/:username',
        method: 'put',
        controller: UserController,
        action: 'createUser'
    },

    //UPDATE USER
    {
        route: '/api/v1/user/:username',
        method: 'post',
        controller: UserController,
        action: 'updateUser'
    },

    //GET USER
    {
        route: '/api/v1/user/:username',
        method: 'get',
        controller: UserController,
        action: 'readUser'
    },

    //GET USERS
    {
        route: '/api/v1/users',
        method: 'get',
        controller: UserController,
        action: 'readUsers'
    },


    //DELETE USER
    {
        route: '/api/v1/user/:username',
        method: 'del',
        controller: UserController,
        action: 'deleteUser'
    },


    // ------------------------------------
    // ------------- TRACKS ---------------
    // ------------------------------------

    //CREATE TRACK
    {
        route: '/api/v1/track/:trackname',
        method: 'put',
        controller: TrackController,
        action: 'createTrack'
    },

    //CREATE TRACK
    {
        route: '/api/v1/track/:trackname',
        method: 'get',
        controller: TrackController,
        action: 'getTrack'
    },

    //CREATE TRACKS
    {
        route: '/api/v1/tracks',
        method: 'get',
        controller: TrackController,
        action: 'getTrackList'
    },


    // ------------------------------------
    // ------------- SCORES ---------------
    // ------------------------------------

    //CREATE SCORE
    {
        route: '/api/v1/score/:trackname',
        method: 'put',
        controller: ScoreController,
        action: 'createScore'
    },

    //GET SCORE
    {
        route: '/api/v1/scores',
        method: 'get',
        controller: ScoreController,
        action: 'getScores'
    }
]





module.exports = function (app) {

    for (var i in applicationRoutes) {

        var attrs = applicationRoutes[i];

        var route = attrs.route;
        var method = attrs.method;
        var controller = attrs.controller;
        var action = controller[attrs.action];


        console.log(route, method)


        if (!method || !controller || !action) {
            return;
        }
        app[method](route, action);


    }
}