// Express and more practical default packages
var express = require('express');
var path = require('path');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var querystring = require('querystring');
// Example qs: 
//				var obj = qs.parse('a=c');    // { a: 'c' }
//				var str = qs.stringify(obj);  // 'a=c'
// passport session
var session = require('express-session');
var flash = require('connect-flash');


var app = express();

// CONFIGURATION OF THE EXPRESS APP
//
// TODO remove this
app.set('env','production');
//process.env.NODE_ENV =
//
// development only

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('host', 'localhost');
app.set('Host', 'localhost:3000');
app.set('protocol', 'http');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
////////////////////////// We don't want any safety leak: allowing url encoding is one?
app.use(bodyParser.urlencoded({ extended: true }));

//app.use( multer( {
//	dest: "./data/"
//} ) );
app.use(cookieParser());
app.use(session({ secret: 'timp' }));
app.use(flash());

//var host = server.address().address;
var host = app.get('host');
var port = app.get('port');


/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////          DATABASE       //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

	var tableNameWhiteList = 'whiteList';
	var tableNameToken = 'token';
	var tableNameUsers = 'users';
	var tableNameSession = 'session';
	var database = require('./config/database')();
	database.initTokenTable(tableNameToken);
	database.initWhiteListTable(tableNameWhiteList);
	database.initUsersTable(tableNameUsers);

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////         EMAIL           //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

	var email = require('./config/email')(database.db, tableNameToken);

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////         PASSPORT        //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

	var auth = require('./config/passport')(app, database.db);
	auth.initPassport();

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////         ROUTES           /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


	// REQUIRED FILES
	var nonUsers = require('./routes/index2')(app, auth.passport, auth.hashPassword, database.db, email.sendByGmail);
	var filebrowserRouter = require('./routes/filebrowserRouter');
	var users = require('./routes/users');
	var imageViewer = require('./routes/imageViewer');

	// File upload
	var multer = require('multer');
	var uploadImageFolder = path.join(__dirname, 'data/images/original');
	app.use( multer({
	  dest: uploadImageFolder,
	  rename: function (fieldname, filename) {
		return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
	  }
	}))

	// STATIC ROUTING
	app.use(express.static(path.join(__dirname, '/public')));
	app.use('/public',express.static(path.join(__dirname, '/public')));
	app.use('/scripts',express.static(path.join(__dirname, '/public/scripts')));
	app.use('/styles',express.static(path.join(__dirname, '/public/styles')));
	app.use('/view', express.static(path.join(__dirname, '/public/scripts')));

	// ROUTING
	app.use('/', nonUsers);
	app.use('/', auth.ensureAuthenticated, filebrowserRouter);
	app.use('/view', auth.ensureAuthenticated, imageViewer);
	app.use('/', auth.ensureAuthenticated, users);

	
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////     ERROR HANDLING      //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {

		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			if (!req.isAuthenticated()) {
				res.render('error', {
					message: 'error.jade: ' + err.message,
					error: err
				});
			} else {
				res.render('users/error', {
					message: 'users/error.jade: ' + err.message,
					error: err,
					user: { 'username' : req.user }
				});
			}
		});
	}

	// production error handler
	// no stacktraces leaked to user
	if (app.get('env') === 'production') {

		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
				if (!req.isAuthenticated()) {
					res.render('error', {
					message: 'error.jade: ' + err.message,
					error: {}
				});
			} else {
				res.render('users/error', {
					message: 'users/error.jade: ' + err.message,
					error: {},
					user: { 'username' : req.user.toString() }
				});
			}
		});
	}

	module.exports = app;
