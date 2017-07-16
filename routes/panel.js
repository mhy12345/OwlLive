var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb','owllivedb');
var room = require('../models/room').room;
var user = require('../models/user');
var message = require('../models/message');
var crypto = require('crypto');
var fs = require('fs');
function md5 (text) {
	return crypto.createHash('md5').update(text).digest('hex');
};

router.get('/', function(req, res, next) {
	if (!req.session.signin || req.session.level != 'Administrator')
	{
		console.log('Attempt use the panel...');
		console.log('User signin status:'+req.session.signin);
		console.log('User level:'+req.session.level);
		var err = new Error('Permission denied.');
		next(err);
	}
	res.render('panel', { page: 'panel', 'user': req.session.user});
});

router.post('/', function(req, res, next){
	if (!req.session.signin || req.session.level != 'Administrator')
	{
		console.log('Attempt use the panel...');
		console.log('User signin status:'+req.session.signin);
		console.log('User level:'+req.session.level);
		var err = new Error('Permission denied.');
		next(err);
		return ;
	}
	console.log(req.body);
	if (req.body.roomid)
	{
		console.log("Upload file to "+req.body.roomid)
		room.findOne({name:req.body.roomid},function(ferr,fres){
			if (!fres)
			{
				var err = new Error('No Such Room..');
				next(err);
			}else
			{
				console.log(req.files);
				var tmp_path = req.files[0].path;
				var target_path = './public/uploads/' + req.body.roomid +'-'+req.files[0].originalname;
				console.log("TMP PATH:"+tmp_path+" FILE PATH:"+target_path);
				fs.rename(tmp_path, target_path, function(err) {
					if (err) throw err;
					fs.unlink(tmp_path, function() {
						if (err) throw err;
						res.send('File uploaded to: ' + target_path + ' - ' + req.files[0].size + ' bytes');
					});
				});
				fres.files.push(req.files[0].originalname);
				fres.save();
			}
		});
		return ;
	}
	if (req.body.command == 'newroom')
	{
		var newRoom = new room;
		newRoom.name = req.body.params;
		newRoom.createTime = new Date;
		newRoom.status = 'Active';
		newRoom.save();
	}else if (req.body.command == 'stoproom')
	{
	}else if (req.body.command == 'freezeuser')
	{
		user.update({'name':req.body.params},{'$set':{'level':'Iceman'}},function(err) {
			console.log('User '+req.body.params+' frozen');
		});
	}else if (req.body.command == 'clearusers')
	{
		user.remove({}, function(err) { 
			console.log('Users removed...') 
		});
	}else if (req.body.command == 'clearmessages')
	{
		message.remove({}, function(err) { 
			console.log('Messages removed...') 
		});
	}else if (req.body.command == 'clearrooms')
	{
		room.remove({}, function(err) { 
			console.log('Rooms removed...') 
		});
	}else if (req.body.command == 'stopregister')
	{
		global.registerflag = false;
	}else if (req.body.command == 'startregister')
	{
		global.registerflag = true;
	}
	res.redirect('/');
});
module.exports = router;
