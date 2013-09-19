/*
 *   THIS NO LONGER WORKS, FIX IT
 * */
var UserController = require('../controllers/UserController');
var TrackController = require('../controllers/TrackController');
var ScoreController = require('../controllers/ScoreController');
var TournamentController = require('../controllers/TournamentController');
var TournamentDataController = require('../controllers/TournamentDataController');
var ProductController = require('../controllers/ProductController');

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
};

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
        method: 'delete',
        controller: UserController,
        action: 'deleteUser'
    },

    
    // ------------------------------------
    // ------------- PRODUCTS -------------
    // ------------------------------------

    //CREATE PRODUCT
    {
        route: '/api/v1/products/:facebookID',
        method: 'put',
        controller: ProductController,
        action: 'createProduct'
    },

    //UPDATE PRODUCT
    {
        route: '/api/v1/products/:facebookID',
        method: 'post',
        controller: ProductController,
        action: 'updateProduct'
    },

    //GET PRODUCTS
    {
        route: '/api/v1/products/:facebookID',
        method: 'get',
        controller: ProductController,
        action: 'readProduct'
    },

    //DELETE PRODUCT
    {
        route: '/api/v1/products/:facebookID',
        method: 'delete',
        controller: ProductController,
        action: 'deleteProduct'
    },


    // ------------------------------------
    // ------------- TRACKS ---------------
    // ------------------------------------

    //CREATE TRACK
    {
        route: '/api/v1/track/:trackkey',
        method: 'put',
        controller: TrackController,
        action: 'createTrack'
    },

    //GET TRACK
    {
        route: '/api/v1/track/:trackkey',
        method: 'get',
        controller: TrackController,
        action: 'getTrack'
    },

    //GET TRACKS
    {
        route: '/api/v1/tracks',
        method: 'get',
        controller: TrackController,
        action: 'getTrackList'
    },
    
    //GET FRIENDS TRACKS
    {
        route: '/api/v1/tracks/related',
        method: 'post',
        controller: TrackController,
        action: 'getFriendTracks'
    },
    
  //SEARCH TRACKS
    {
        route: '/api/v1/tracks/search/:search',
        method: 'get',
        controller: TrackController,
        action: 'searchTracks'
    },
    
  //DELETE ALL TRACKS
    {
        route: '/api/v1/tracks/clear',
        method: 'delete',
        controller: TrackController,
        action: 'deleteAllTracks'
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
    },
    
  //GET SCORES FOR TRACK
    {
        route: '/api/v1/scores/:trackkey',
        method: 'post',
        controller: ScoreController,
        action: 'getScoresForTrack'
    },
    
    //REMOVE ALL SCORES FROM DATABASE
    {
        route: '/api/v1/scores/clear',
        method: 'delete',
        controller: ScoreController,
        action: 'deleteAllScores'
    },
    
    // ------------------------------------
    // ----------- TOURNAMENTS -----------
    // ------------------------------------
    {
        route: '/api/v1/tournament/leader/:tournamentid',
        method: 'get',
        controller: TournamentController,
        action: 'getTournamentLeader'
    },
    
    
    // ------------------------------------
    // --------- TOURNAMENTS DATA --------
    // ------------------------------------

    //CREATE TOURNAMENT DATA
    {
        route: '/api/v1/tournament/admin',
        method: 'put',
        controller: TournamentDataController,
        action: 'createTournament'
    },
  //GET ALL TOURNAMENTS
    {
        route: '/api/v1/tournaments/all',
        method: 'get',
        controller: TournamentDataController,
        action: 'getAllTournaments'
    },
  //GET ACTIVE TOURNAMENTS
    {
        route: '/api/v1/tournaments/active',
        method: 'get',
        controller: TournamentDataController,
        action: 'getActiveTournaments'
    },
    //DELETE TOURNAMENT DATA
    {
        route: '/api/v1/tournament/admin/:tournamentid',
        method: 'delete',
        controller: TournamentDataController,
        action: 'deleteTournament'
    }
];





module.exports = function (app) {

    for (var i in applicationRoutes) {

        var attrs = applicationRoutes[i];

        var route = attrs.route;
        var method = attrs.method;
        var controller = attrs.controller;
        var action = controller[attrs.action];


        console.log(route, method);


        if (!method || !controller || !action) {
            return;
        }
        app[method](route, action);


    }
};