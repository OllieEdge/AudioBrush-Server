var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tournament = Schema({
	scores: [{ type: Schema.Types.ObjectId, ref: 'Score' }],
	track: { type: Schema.Types.ObjectId, ref: 'Track' }
})

mongoose.model('Tournament', Tournament);
module.exports = mongoose.model('Tournament');

