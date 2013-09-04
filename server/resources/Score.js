var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;


var Score = mongoose.Schema({
    trackname: ObjectId,
    username : ObjectId,
    score    : {
        type: Number,
        default: 0
    }
});

mongoose.model('Score', Score);
module.exports = mongoose.model('Score');