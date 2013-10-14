var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Achievement = mongoose.Schema({
    owner			: { type: Schema.Types.ObjectId, ref: 'User', index:true },
        
    updated: {
        type: Date,
        "default": Date.now()
    },
    completed: {
        type: Date
    },
    progress: {
        type: Number
    },
    achievementID: {
        type: Number,
        index:true
    },
    reward: {
        type: String
    },
    credits: {
    	type: Number
    }
});

mongoose.model('Achievement', Achievement);


module.exports = mongoose.model('Achievement');