var mongoose = require('mongoose');
var roomSchema = new mongoose.Schema({
	name:String,
	createTime:Date,
	status:String
});
module.exports=mongoose.model('rooms', roomSchema);
