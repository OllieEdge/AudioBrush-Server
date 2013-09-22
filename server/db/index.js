var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('../resources/User');
var Track = require('../resources/Track');
var Score = require('../resources/Score');
var Product = require('../resources/Product');
var Tournament = require('../resources/Tournament');
var TournamentData = require('../resources/TournamentData');
var Gift = require('../resources/Gift');

mongoose.connection.on('error', function (err) {
//	console.log('MONGOOSE CONNECTION ERROR <---')
//	console.log(err)
});

mongoose.connection.on('connecting', function (data) {
//	console.log('MONGOOSE CONNECTING <---')
//	console.log(data)
});

mongoose.connection.on('connected', function (data) {
//	console.log('MONGOOSE CONNECTED <---')
//	console.log(data)
});


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('localhost', 'audiobrush');