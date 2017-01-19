var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost','test');
var user = require('../models/user');
var message = require('../models/message');
var math = require('mathjs');

function actionCheck(name)
{
	user.findOne({'name':name},function(ferr,fres){
		var curDate = new Date;
		console.log(curDate-fres.lastAction);
	});
}

router.get('/loadmessage', function(req, res, next) {
	if (req.query.room == null)
	{
		res.redirect("../");
	}
	console.log(">>>"+req.query.room);
	message.find({'room':req.query.room}).sort({'_id':-1}).limit(20).exec(
			function(err,fres){
				console.log('load message');
				fres.sort(function(a,b){
					return (b.postTime.getTime()/1000 + (b.like+1)/2) -
						(a.postTime.getTime()/1000 + (a.like+1)/2);
				});
			/*	fres.forEach(function(it){
					console.log(" "+ (it.postTime.getTime()/1000 + math.log(it.like+1)));
				});*/
				res.render('loadmessage',{'mlist':fres,'user':req.session.user});
			});
});

router.post('/sendmessage', function(req, res, next){
	if (!req.session.user)
	{
		res.redirect("../login");
	}else
	{
		user.findOne({'name':req.session.user},function(ferr,fres){
			if (fres.level =='Iceman')
			{
				var err = new Error('You don\'t have permission to send message.');
				next(err);
			}else if (req.body.message.length>300)
			{
				var err = new Error('Your message is too long.');
				next(err);
			}else
			{
				var newMessage = new message;
				newMessage.text = req.body.message;
				newMessage.room = req.body.room;
				newMessage.user = req.session.user;
				newMessage.postTime = new Date;
				newMessage.status = 1;
				newMessage.like = 0;
				console.log(newMessage);
				newMessage.save();
				res.redirect("../room?room="+req.body.room);
			}
		});
	}
});


router.post('/likemessage', function(req, res, next){
	if (req.session.signin)
	{
		require('date-utils');
		var cDate = new Date();
		console.log(cDate);
		cDate = cDate.addSeconds(-5);
		console.log(cDate);
		user.where('lastAction').lt(cDate).exec(function(ferr,fres){
			if (fres.length || req.session.level == 'Administrator')
			{
				message.update({'_id':req.body.messageid},{'$inc':{'like':1}},function(ferr,fres){
					console.log('User '+req.session.user+' like '+req.body.messageid);
					user.update({'name':req.session.user},{'$set':{'lastAction':new Date}},function(ferr){
						console.log('Update user action time'+req.session.user+new Date);
					});
				});
			}
	});
	}
});
module.exports = router;
