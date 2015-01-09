// Express and more practical default packages
var express = require('express');
var path = require('path');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
// Query strings with recursive depth
//var qs = require('qs');
var querystring = require('querystring');
// Example qs: 
//				var obj = qs.parse('a=c');    // { a: 'c' }
//				var str = qs.stringify(obj);  // 'a=c'
// passport session
var session = require('express-session');
var flash = require('connect-flash');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
//var crypto = require('crypto');
//var xoauth2 = require('xoauth2');
//// sending emails
//var nodemailer = require('nodemailer');
//var smtpTransport = require('nodemailer-smtp-transport');

// File upload
var multer = require('multer');

var app = express();


//var routes = require('./routes/index');

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
app.use(express.static(path.join(__dirname, '/public')));
app.use('/public',express.static(path.join(__dirname, '/public')));
app.use('/scripts',express.static(path.join(__dirname, '/public/scripts')));
app.use('/styles',express.static(path.join(__dirname, '/public/styles')));
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
//////////////////////////////          VIEWS          //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


	var nonUsers = require('./routes/index2')(app, auth.passport, auth.hashPassword, database.db, email.sendByGmail);
//	var uploads = require('./routes/upload');
//	var downloads = require('./routes/download');
	var filebrowserRouter = require('./routes/filebrowserRouter');
	var users = require('./routes/users');
	var imageViewer = require('./routes/imageViewer');

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////         USER VIEWS       /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

	app.use('/', nonUsers);
//	app.use('/upload', auth.ensureAuthenticated, uploads);
//	app.use('/download', auth.ensureAuthenticated, downloads);
	app.use('/', auth.ensureAuthenticated, filebrowserRouter);
	app.use('/view', auth.ensureAuthenticated, imageViewer);
	app.use('/view', express.static(path.join(__dirname, '/public/scripts')));
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
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});

	module.exports = app;
