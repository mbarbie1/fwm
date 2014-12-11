var express = require('express');
var router = express.Router();
var passport = require('passport')
	, flash = require('connect-flash')
	, LocalStrategy = require('passport-local').Strategy;

var sqlite3 = require('sqlite3').verbose();

router.use(passport.initialize());
router.use(passport.session());

var db = new sqlite3.Database('./usersdb.sqlite3');

//function initdb(db)

//	db.serialize(function() {

		//db.run( 'CREATE TABLE ' +
		//	'( ' + 'id ' + 'INTEGER PRIMARY KEY  AUTOINCREMENT, '
		//	'( ' + 'username ' + 'TEXT, '
		//	'( ' + 'password ' + 'TEXT, '
		//	'( ' + 'salt ' + 'TEXT )'
		//);

	//});

//}

//module.exports = function(app) {


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
	  db.get('SELECT salt FROM users WHERE username = ?', username, function(err, row) {
		if (!row) return done(null, false);
		var hash = hashPassword(password, row.salt);
		db.get('SELECT username, id FROM users WHERE username = ? AND password = ?', username, hash, function(err, row) {
		  if (!row) return done(null, false);
		  return done(null, row);
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

	router.get('/', function (req, res) {
		res.render('index', { user : req.user });
	});

	router.get('/register', function(req, res) {
		res.render('register', { });
	});

	router.post('/register', function(req, res) {
		Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
			if (err) {
				return res.render('register', { account : account });
			}

			res.redirect('/');
		});
	});

	router.get('/login', function(req, res) {
		res.render('login', { user : req.user });
	});

	router.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				req.flash('error', info.message);
				return res.redirect('/login')
			}
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.redirect('/users/' + user.username);
			});
		})(req, res, next);
	});
//	app.post('/login', passport.authenticate('local', { successRedirect: '/good-login',
//                                                   failureRedirect: '/bad-login' }));

	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

//}
