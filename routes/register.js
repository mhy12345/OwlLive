var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb','owllivedb');
var user = require('../models/user');
var crypto = require('crypto');
function md5 (text) {
	return crypto.createHash('md5').update(text).digest('hex');
};

db.once('open',function(){  
	console.log('DB open success..');  
	var schema = mongoose.Schema({  
		title:String  
	}); 
});

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.signin)
	{
		res.redirect("/");
	}
	res.render('register', { page: 'register'});
});

router.post('/', function(req, res, next){
	if (global.registerflag == null)
		global.registerflag = true;
	if (!global.registerflag)
	{
		var err = new Error('You cannot register now!');
		next(err);
		return ;
	}
	console.log("Registration requestion occur");
	console.log("User name:"+req.body.name);
	user.findOne({name:req.body.name},function(ferr,fres){
		if (fres!=null){
			console.log("User name "+req.body.name+" already in used!");
			var err = new Error('User name '+req.body.name+' already in used!');
			next(err);
			return ;
		}else{
			console.log("User name checked...");
			var newUser = new user;
			var uname = req.body.name;
			if (uname.length>15)
			{
				console.log("User name "+req.body.name+" is too long!");
				var err = new Error('User name '+req.body.name+' is too long!');
				next(err);
				return ;
			}
	// Why on earth do you block we from registering a good username?
			newUser.name = req.body.name;
			newUser.password = md5(req.body.password);
			newUser.lastAction = null;
			newUser.registerTime = new Date();
			user.findOne({},function(ferr,fres){
				if (fres == null)
				{
					newUser.level = 'Administrator';
				}else
				{
					newUser.level = 'User';
				}
				newUser.save(function(error) {
					if(error) {
						console.log('Error:'+error);
					} else {
						console.log('saved OK!');
					}
				});
				console.log(newUser); 
				res.redirect("/");
				//res.end("Succeed!");
			});
		}
	});
});

module.exports = router;
