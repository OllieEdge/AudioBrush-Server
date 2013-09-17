mongoose = require('mongoose');

Product = mongoose.Schema({
    productID    : {
        type: String
    },
    fb_id       : {
        type: Number,
        index:true
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
    quantity: {
    	type: Number,
    	"default":1
    }
});

mongoose.model('Product', Product);


module.exports = mongoose.model('Product');