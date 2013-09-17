mongoose = require('mongoose');


var Track = mongoose.Schema({
    trackname       : {
        type: String,
        index: true
    },
    artist     : {
        type: String,
        index: true
    },
    plays      : {
        type: Number,
        "default": 1
    },
    last_update: {
        type   : Date,
        "default": Date.now
    }
});

mongoose.model('Track', Track);
module.exports = mongoose.model('Track');