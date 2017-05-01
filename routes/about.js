var express = require('express');
var router = express.Router();
var user = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  user.find(function(ferr,fres){
	  console.log(fres);
	  res.render('plain',{'title':'About', 'content': 'A Live Discuss System by mhy12345', 'user':req.session.user});
  });
});

module.exports = router;
