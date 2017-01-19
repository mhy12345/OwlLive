var express = require('express');
var router = express.Router();
var user = require('../models/room');

/* GET users listing. */
router.get('/', function(req, res, next) {
  user.find(function(ferr,fres){
	  if (!req.query.room)
	  {
		  res.render('rooms',{'rtable':fres,'user':req.session.user});
	  }else
	  {
		  console.log(fres);
		  res.render('room',{'room':req.query.room,'user':req.session.user});
	  }
  });
});

module.exports = router;
