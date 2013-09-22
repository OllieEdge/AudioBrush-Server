var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

User = mongoose.Schema({
    username    : {
        type: String
    },
    credits     : {
        type: Number,
        "default":40
    },
    unlimited   : {
        type: Boolean,
       "default":false
    },
    fb_id       : {
        type: Number,
        index:true
    },
    role        : {
        type: String,
        "default": "player"
    },
    tracks	: {
    	type: []
    },
    created: {
        type: Date,
        "default": Date.now(),
        index:true
    },
    updated: {
        type: Date,
        "default": Date.now
    },
    airship_token: {
        type: String,
        "default": ""
    }
});

User.plugin(passportLocalMongoose);
mongoose.model('User', User);


module.exports = mongoose.model('User');