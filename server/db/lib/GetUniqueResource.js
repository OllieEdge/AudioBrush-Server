var mongoose = require('mongoose');

module.exports = function(resourceType, attributes, next){
	return mongoose.model(resourceType).findOne(attributes).lean().exec(next);
};