var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	name:String,
	password:String,
	level:String,
	lastAction:Date,
	registerTime:Date
});
module.exports=mongoose.model('users', UserSchema);
