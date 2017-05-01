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
	req.session.signin = null;
	req.session.user = null;
	res.redirect("/");
});

module.exports = router;
