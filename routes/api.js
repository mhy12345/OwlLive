var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb','owllivedb');
var user = require('../models/user');
var message = require('../models/message');
var math = require('mathjs');
var room = require('../models/room').room;
var participant = require('../models/room').participant;
var date_utils=require('date-utils');

function actionCheck(name)
{
	user.findOne({'name':name},function(ferr,fres){
		var curDate = new Date;
		console.log(curDate-fres.lastAction);
	});
}

router.get('/loadmessage', function(req, res, next) {
	if (req.query.room == null) {
		res.redirect("../");
	}
	console.log('...',req.query.current_time)
	message.find({'room':req.query.room}).sort({'_id':-1}).limit(20).exec(
			function(err,fres){
				console.log(fres);
				res.render('loadmessage',{'mlist':fres,'user':req.session.user,'last_time':req.query.current_time});
			});
});

router.post('/sendmessage', function(req, res, next){
	if (!req.session.user) {
		res.redirect("../login");
	}else {
		user.findOne({'name':req.session.user},function(ferr,fres){
			if (fres.level =='Iceman') {
				var err = new Error('You don\'t have permission to send message.');
				next(err);
			}else if (req.body.message.length>300)
			{
				var err = new Error('Your message is too long.');
				next(err);
			}else
			{
				user.where('name').equals(req.session.user).where('lastAction').lt(new Date().addSeconds(-5)).exec(function(ferr,fres){
					if (fres.length || req.session.level == 'Administrator')
					{
						user.update({'name':req.session.user},{'$set':{'lastAction':new Date}},function(ferr){});
						var newMessage = new message;
						newMessage.text = req.body.message;
						newMessage.room = req.body.room;
						newMessage.user = req.session.user;
						newMessage.postTime = new Date;
						newMessage.status = 1;
						newMessage.like = 0;
						//console.log(newMessage);
						newMessage.save();
						res.redirect("../room?room="+req.body.room);
					}else
					{
						var err = new Error('Do not send message too fast');
						next(err);
					}
				});
			}
		});
	}
});


router.post('/likemessage', function(req, res, next){
	if (req.session.signin)
	{
		user.where('name').equals(req.session.user).where('lastAction').lt(new Date().addSeconds(-5)).exec(function(ferr,fres){
			if (fres.length || req.session.level == 'Administrator')
			{
				message.update({'_id':req.body.messageid},{'$inc':{'like':1}},function(ferr,fres){
					console.log('User '+req.session.user+' like '+req.body.messageid);
					user.update({'name':req.session.user},{'$set':{'lastAction':new Date}},function(ferr){});
				});
			}
		});
	}
});

router.post('/votestatus', function(req, res, next){
	if (req.session.signin)
	{
		var st = req.body.nStatus;
		var user = req.session.user;
		var roomId = req.body.room;
		//console.log('here' + roomId + " " + user + " " + st);
		room.findOne({'name':roomId,'participants.name':user},function(ferr,fres){
			if (fres)
			{
				console.log("Case 1");
				for (var i=0;i<fres.participants.length;i++) {
					if (fres.participants[i].name == user)
						fres.participants[i].chosen = st;
				}
				fres.save();
				//	console.log(fres);
			}else
			{
				console.log("Case 2");
				room.findOne({'name':roomId},function(ferr,fres){
					var newParticipant =new participant;
					newParticipant.name = user;
					newParticipant.chosen = st;
					fres.participants.push(newParticipant);
					fres.save();
					//		console.log(newParticipant);
					//		console.log(fres);
				});
			}
		});
	}
	res.end();
});

router.get('/votestatus', function(req, res, next){
	//console.log(req.query.room);
	room.findOne({'name':req.query.room},function(ferr,fres){
		if (ferr)
		{
			res.end();
			return ;
		}
		var cnt = new Array();
		var sum = 0;
		cnt['Fast']=cnt['Good']=cnt['Slow']=cnt['GiveUp']=0;
		console.log("Case #3");
		if (fres== null)
		{
			res.end();
			return ;
		}
		for (var i=0;i<fres.participants.length;i++)
			cnt[fres.participants[i].chosen]++,sum++;
		cnt['Fast']/=sum/100.0;cnt['Good']/=sum/100.0;cnt['Slow']/=sum/100.0;cnt['GiveUp']/=sum/100.0;
		var result="";
		for (i in cnt){
			result += JSON.stringify(cnt[i]) + ",";
		}
		//console.log(result);
		res.end(result);
		//res.end(cnt['Fast']+" "+cnt['Good']+" " + cnt['Slow']+" "+cnt['GiveUp']);
		//var json=require('json');
		//console.log(JSON.stringify(cnt));
		//res.end(JSON.stringify(cnt));
	});
});
module.exports = router;
