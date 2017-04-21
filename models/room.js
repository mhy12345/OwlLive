var mongoose = require('mongoose');
var participantsSchema = new mongoose.Schema({
	name : String,
	chosen : String
});
var roomSchema = new mongoose.Schema({
	name:String,
	createTime:Date,
	status:String,
	participants:[participantsSchema],
});
module.exports.room=mongoose.model('rooms', roomSchema);
module.exports.participant=mongoose.model('participants', participantsSchema);
