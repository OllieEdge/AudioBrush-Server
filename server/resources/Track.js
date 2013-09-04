mongoose = require('mongoose')


module.exports = mongoose.Schema({
    name       : String,
    artist     : String,
    plays      : Number,
    last_update: {
        type   : Date,
        default: Date.now
    }
});