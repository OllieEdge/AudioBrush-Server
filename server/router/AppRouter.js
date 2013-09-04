var UserController = require('../controllers/UserController');
var TrackController = require('../controllers/TrackController');
var ScoreController = require('../controllers/ScoreController');

var routes = {
    // --- USERS ---
    '/user/create/:username': UserController.createUser,

    '/user/read/:username'  : UserController.readUser,
    '/user/update/:username': UserController.updateUser,
    '/user/delete/:username': UserController.deleteUser,

    '/users/read/'            : UserController.readUsers,


    // --- TRACKS ---
    '/track/create/:trackName': TrackController.createTrack,

    '/track/read/:trackName'  : TrackController.getTrack,
    '/track/update/:trackName': TrackController.updateTrack,

    '/tracks/get/'            : TrackController.getTrackList,


    // --- SCORES ---
    '/score/create/:trackName': ScoreController.createScore
}

module.exports = function (app) {
    for (var route in routes) {
        app.post(route, routes[route])
    }
};