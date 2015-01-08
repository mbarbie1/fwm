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
app.use( multer( {
	dest: "./users/public/data/"
} ) );
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
	var uploads = require('./routes/upload');
	var downloads = require('./routes/download');
	var filebrowserRouter = require('./routes/filebrowserRouter');
	var users = require('./routes/users');
	var imageViewer = require('./routes/imageViewer');

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////         USER VIEWS       /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

	app.use('/', nonUsers);
	app.use('/upload', auth.ensureAuthenticated, uploads);
	app.use('/download', auth.ensureAuthenticated, downloads);
	app.use('/list', auth.ensureAuthenticated, filebrowserRouter);
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















/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////          DATABASE       //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
	
/* 	//////////////////////////////    WHITELIST OF USERS   //////////////////////////////////////////
	var tableNameWhiteList = 'whiteList';
	function initWhiteListTable() {
		db.serialize( function() {
			var sqlQuery = 'CREATE TABLE IF NOT EXISTS ' + tableNameWhiteList + ' '
				+ '( ' + 'id ' + 'INTEGER PRIMARY KEY, '
				+ 'email ' + 'TEXT, '
				+ 'permission ' + 'TEXT )';
			db.run( sqlQuery );
		});
	}
	// check whether email-address is on whitelist
	initWhiteListTable();

	
	//////////////////////////////     GMAIL SMTP TOKEN     //////////////////////////////////////////
	var tableNameToken = 'token';
	function initTokenTable() {
		db.serialize( function() {
			var sqlQuery = 'CREATE TABLE IF NOT EXISTS ' + tableNameToken + ' '
				+ '( ' + 'id ' + 'INTEGER PRIMARY KEY, '
				+ 'user ' + 'TEXT, '
				+ 'clientId ' + 'TEXT, '
				+ 'clientSecret ' + 'TEXT, '
				+ 'refreshToken ' + 'TEXT, '
				+ 'token ' + 'TEXT )';
			db.run( sqlQuery );
		});
	}
	initTokenTable();

	//////////////////////////////     USER CREDENTIALS     //////////////////////////////////////////
	var tableNameUsers = 'users';
	// Check whether table "usersTableName" exists, if not, create it
	// The table needs the columns (id, email, username, password (which is the hash of the real password), salt)
	function initUsersTable() {
		db.serialize( function() {
			var sqlQuery = 'CREATE TABLE IF NOT EXISTS ' + tableNameUsers + ' '
				+ '( ' + 'id ' + 'INTEGER PRIMARY KEY, '
				+ 'email ' + 'TEXT, '
				+ 'username ' + 'TEXT, '
				+ 'password ' + 'TEXT, '
				+ 'salt ' + 'TEXT, '
				+ 'valid ' + 'INTEGER, '
				+ 'permission ' + 'TEXT )';
			db.run( sqlQuery );
		});
	}
	initUsersTable();
 */	
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////         EMAIL           //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

/* 	function sendByGmail( sender, receiver, contentHtml, contentText, subject ) {
		db.get('SELECT * FROM ' + tableNameToken + ' WHERE id = 1', function(err, row) {
			if (!row) {
				console.log("initGenerator: No row");
			} else {
				console.log("Passport.use: OK");
				console.log(row.toString());
				var generatorAuth = {
					user: row.user,
					clientId: row.clientId,
					clientSecret: row.clientSecret,
					refreshToken: row.refreshToken
					//token: row.token
				};
				var generator = xoauth2.createXOAuth2Generator( generatorAuth );
				// listen for token updates
				// you probably want to store these to a db
				generator.on('token', function(token){
					console.log('New token for %s: %s', token.user, token.accessToken);
				});
				sendEmail( generator, sender, receiver, contentHtml, contentText, subject );
			}
		});
	}

	function sendEmail( generator, sender, receiver, contentHtml, contentText, subject ) {
		// Use Smtp Protocol to send Email
		var transport = nodemailer.createTransport(smtpTransport({
			service: 'gmail',
			auth: {
				xoauth2: generator
			}
		}));
		var mail = {
			from: sender,
			to: receiver,
			subject: subject,
			text: contentText,
			html: contentHtml
		}
		transport.sendMail(mail, function(error, response){
			if(error){
				console.log(error);
			}else{
				console.log("Message sent: " + response.message);
			}

			transport.close();
		});
	} */

	
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////         PASSPORT        //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
/* 	app.use(passport.initialize());
	app.use(passport.session());
	

	function hashPassword(password, salt) {
		var hash = crypto.createHash('sha256');
		hash.update(password);
		hash.update(salt);
		return hash.digest('hex');
	}

	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login')
	}

	passport.use(new LocalStrategy(function(username, password, done) {

		console.log("Username: " + username);
		db.get('SELECT * FROM users WHERE username = ?', username, function(err, row) {
			if (!row) {
				console.log("No row in select salt with username and password");
				return done(null, false);
			} else {
				console.log("ok salt found, we move on");
			}
			var hash = hashPassword(password, row.salt);
			var email = row.email;
			console.log('1) email from the whitelist : ' + email)
			db.serialize( function() {
				console.log('2) email from the whitelist : ' + email)
				db.get('SELECT email, permission FROM whitelist WHERE email = $email', { $email: email }, function(err, rowWhiteList) {
					if (!rowWhiteList ) {
						console.log("Passport.use: email not in whiteList, stop");
						return done(null, false);
					} else {
						console.log("Passport.use: email in whiteList, continue");
						//return done(null, rowWhiteList);
					}
				});
				db.get('SELECT username, id, valid FROM users WHERE username = ? AND password = ?', username, hash, function(err, row) {
					if (!row ) {
						return done(null, false);
						console.log("Passport.use: No row in select username with username and password");
					} else {
						if (row.valid == true) {
							console.log("Passport.use: OK");
							console.log(row.toString());
							return done(null, row);
						} else {
							console.log("Passport.use: Not a valid user: confirm your registration");
							console.log(row.toString());
							return done(null, false);
						}
					}
				});
			});
		});
	}));

	passport.serializeUser(function(user, done) {
		return done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		db.get('SELECT id, username FROM users WHERE id = ?', id, function(err, row) {
			if (!row) return done(null, false);
			return done(null, row);
		});
	});

	// Code snippet from Tom Pawlak: http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
	function random (howMany, chars) {
		chars = chars 
			|| "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
		var rnd = crypto.randomBytes(howMany)
			, value = new Array(howMany)
			, len = chars.length;

		for (var i = 0; i < howMany; i++) {
			value[i] = chars[rnd[i] % len]
		};

		return value.join('');
	}
 */
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////          VIEWS          //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
	// Introduction page
	app.get('/', function (req, res) {
		res.render('index', { user : req.user });
	});

	// Registration page
	app.get('/register', function(req, res) {
		res.render('register', { });
	});
	// Registration post
	app.post('/register', function(req, res) {
		console.log("Started: post( /register , function(req, res) { ...");
		// log each request to the console
		console.log(req.body.username, req.url);

		// making the salt
		var saltLength = 64;
		crypto.randomBytes(saltLength, function (ex, buf) {
			if (ex) throw ex;
			var salt = buf.toString();
			hash = hashPassword( req.body.password, salt);
	//		hash = hashPassword(JSON.stringify(req.body.password), salt);
			var stmt = db.prepare("INSERT INTO users (username, email, password, salt) VALUES ( ? , ? , ? , ? )");
			stmt.run( req.body.username, req.body.email, hash, salt );
			stmt.finalize();

			return res.render('registeredUser');
		});
	});

	// Registration by mail page
	app.get('/registerByEmail', function(req, res) {
		res.render('registerByEmail', { });
	});
	// Registration post
	var registrationBaseUrl = '/registrationConfirmation';

	app.post('/registerByEmail', function(req, res) {
		console.log("Started: post( /registerByEmail , function(req, res) { ...");

		// Send Register email
		var saltLength = 64;
		var timeStamp = moment(new Date());
		crypto.randomBytes(saltLength, function (ex, buf) {
			if (ex) throw ex;
			var salt = buf.toString();
			hash = hashPassword( req.body.password, salt);

			db.run("INSERT INTO users (username, email, password, salt, valid) VALUES ( $username , $email , $password , $salt, $valid )", 
			{$email:req.body.email, $username:req.body.username, $password:hash, $salt:salt, $valid:false});

			var sender = "Michael Barbier <michael.barbier@gmail.com>";
			var receiver = req.body.email;
			var subject = "Registration FWM: to " + receiver;

			var confirmationQuery = querystring.stringify({"email":req.body.email, "password": hash});
			var urlObj = { 'protocol': app.get('protocol'), 'hostname':app.get('host'), 'host':app.get('Host'), 'port':app.get('port'), 'pathname': registrationBaseUrl, 'search' : confirmationQuery };
			var confirmationUrl = url.format(urlObj);
			var contentText = "You receive this email because someone (probably you), used this email-address to "
				+ "Please click on the following link to confirm your submitted credentials to sign in\n:  " + confirmationUrl;
			var contentHtml = jade.renderFile( __dirname + '/views/registrationEmailContent.jade', { pageData: { 'email':req.body.email, 'url':confirmationUrl, 'ref':timeStamp } } );
			console.log(contentHtml);
			
			sendByGmail( sender, receiver, contentHtml, contentText, subject );
		});
		return res.render( 'registrationByEmail', { pageData:{ ref:timeStamp } } );

	});

	// Registration confirmation post
	app.get(registrationBaseUrl, function(req, res) {
		console.log("Started: get( /registrationConfirmation , function(req, res) { ...");
		console.log("Email: " + req.query.email);
		console.log("Email: " + req.query.email.toString());
		console.log("Password: " + req.query.password);
		console.log("Password: " + req.query.password.toString());
//		db.run("SELECT * FROM users WHERE email = $email", {$email: req.query.email}, function(err, row) {
		db.serialize(function() {
			db.get("SELECT * FROM users", function(err, row) {
				if (!row) {
					console.log(req.query.email);
					console.log(req.query.password);
					console.log("No row in select salt with email and password");
				} else {
					console.log("ok salt found, we move on");
					if (row.password == req.query.password) {
						db.run("UPDATE users SET valid = $valid WHERE email = $email", {$valid:true, $email:req.query.email.toString()});
						console.log("email registration confirmation SUCCES");
						return res.redirect('/login');
					} else {
						console.log("false email registration confirmation FAILED");
						return res.redirect('/registerByEmail');
					}
				}
			});
		});
	});

	// Login page
	app.get('/login', function(req, res) {
		res.render('login', { user : req.user });
	});

	// Login post
	app.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				req.flash('error', 'Not a user'); //info.message);
				console.log("Error, Not a user");
				return res.redirect('/login')
			}
			req.logIn(user, function(err) {
				req.flash('message', 'LogIn'); //info.message);
				if (err) { return next(err); }
				return res.redirect('/users/home/' + user.username);
			});
		})(req, res, next);
	});

	// Logout
	app.get('/logout', function(req, res) {
		req.logOut();
		req.session.destroy(function (err) {
			res.redirect('/'); //Inside a callback… bulletproof!
		});
	});
 */
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////        DEBUGGING        //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

	// This is for debugging
/* 	app.get('/userList', function(req,res) {

		db.serialize(function() {
			db.each("SELECT * FROM users", function(err, row) {
				console.log(row.id + ":\n username: " + row.username + "\n Password: " + row.password + "\n Salt: " + row.salt);
			});

			db.run("SELECT * FROM users WHERE username = ?", "user", function(err, row) {
				if (!row) {
					console.log("userList: No row in select salt with username and password");
				} else {
					console.log("userList: Alright, next test");
				}
			});
		});

		return res.render('login');
	}); */

	
