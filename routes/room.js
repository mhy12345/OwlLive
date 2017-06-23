var express = require('express');
var router = express.Router();
var room = require('../models/room').room;

router.get('/', function(req, res, next) {
	room.find(function(ferr,fres){
		if (!req.query.room)
		{
			res.render('rooms',{'rtable':fres,'user':req.session.user});
		}else
		{
			if (!req.session.user)
			{
				next(Error("Please login"));
				return;
			}
			room.findOne({name:req.query.room},function(ferr,fres){
				if (!fres)
				{
					var err = new Error("Room not exist...");
					next(err);
				} else
				{
					console.log(fres);
					res.render('room',{'room':req.query.room,'user':req.session.user,'files':fres.files});
				}
			});
		}
	});
});

module.exports = router;
