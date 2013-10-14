mongoose = require('mongoose');


var Track = mongoose.Schema({
    trackname       : {
        type: String,
    },
    artist     : {
        type: String,
    },
    trackkey     : {
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
    },
    difficulty:{
    	type:Number
    }
});

mongoose.model('Track', Track);
module.exports = mongoose.model('Track');