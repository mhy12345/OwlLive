var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var multer = require('multer');
mongoose.connect('mongodb://mongodb/owllivedb');


var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var login = require('./routes/login');
var logout = require('./routes/logout');
var echo = require('./routes/echo');
var panel = require('./routes/panel');
var room = require('./routes/room');
var api = require('./routes/api');
var about = require('./routes/about');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(session({
	    secret: 'hubwiz app', //secret的值建议使用随机字符串
		    cookie: {maxAge: 60 * 1000 * 30} // 过期时间（毫秒）
}));

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('file'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', room);
app.use('/users', users);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/panel', panel);
app.use('/room', room);
app.use('/api',api);
app.use('/about',about);

//app.use(express.json({limit: '5000kb'}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error',{'user' : req.session.user});
});

module.exports = app;
