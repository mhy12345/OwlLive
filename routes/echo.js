var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/', function(req, res, next) {
	//console.log(req);
	console.log("REQUEST QUERY:"+req.query);  
	console.log("REQUEST PARAMS:"+req.params);
	console.log("REQUEST BODY:"+req.body);  
	res.render('plain', { title: 'Echo', content: 'haha' });
});

module.exports = router;
