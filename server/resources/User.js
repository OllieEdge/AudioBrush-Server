mongoose = require('mongoose');

User = mongoose.Schema({
    username    : {
        type: String
    },
    credits     : Number,
    unlimited   : {
        type: Boolean
    },
    fb_id       : {
        type: Number,
        index: true
    },
    role        : {
        type: String,
        default: 'player'
    },
    created: {
        type: Date,
        default: Date.now(),
        index: true
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('User', User)


module.exports = mongoose.model('User');