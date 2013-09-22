var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Gift = mongoose.Schema({
    to			: { type: Schema.Types.ObjectId, ref: 'User' },
    from	: { type: Schema.Types.ObjectId, ref: 'User' },
        
    sent: {
        type: Date,
        "default": Date.now()
    },
    expires: {
        type: Date
    },
    credits: {
        type: Number
    },
    productID: {
        type: String
    },
    productQuantity: {
    	type: Number,
    	"default":1
    }
});

mongoose.model('Gift', Gift);


module.exports = mongoose.model('Gift');