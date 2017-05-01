var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost','test');

var user = require('../models/user');
var crypto = require('crypto');
function md5 (text) {
	return crypto.createHash('md5').update(text).digest('hex');
};

router.get('/', function(req, res, next) {
	if (req.session.signin)
	{
		res.redirect("/");
	}
	res.render('login', { page: 'login'});
});

router.post('/', function(req, res, next){
	user.findOne({name:req.body.name},function(ferr,fres){
		if (fres == null)
		{
			var err = new Error('No such user '+req.body.name+'.');
			next(err);
		}else
		{
			if (fres.password!=md5(req.body.password))
			{
				var err = new Error('Wrong password.');
				next(err);
			}else
			{
				req.session.signin = true;
				req.session.user = req.body.name;
				req.session.level = fres.level;
				user.update({'name':req.body.name},{'$set':{'lastAction':new Date}},function(err){
					console.log("Update user action time");
				});
			//	console.log('>>>'+req.session.level);
				res.redirect("/");
			}
		}
	});
});
module.exports = router;
