var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
	text:String,
	user:String,
	room:String,
	postTime:Date,
	like:Number,
	status:Number
});
module.exports=mongoose.model('messages', MessageSchema);
