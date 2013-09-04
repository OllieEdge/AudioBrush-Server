mongoose = require('mongoose')


module.exports = mongoose.Schema({
    name     : String,
    credits  : Number,
    unlimited: Boolean,
    fb_id    : Number
});