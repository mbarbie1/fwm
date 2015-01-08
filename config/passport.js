module.exports = function auth(app,db) {

	var flash = require('connect-flash');
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var crypto = require('crypto');

	var module = {};

	module.passport = passport;

	hashPassword = function(password, salt) {
		var hash = crypto.createHash('sha256');
		hash.update(password);
		hash.update(salt);
		return hash.digest('hex');
	}
	module.hashPassword = hashPassword;
	
	module.ensureAuthenticated = function (req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login')
	}

	module.initPassport = function() {

		// Initialize Passport!  Also use passport.session() middleware, to support
		// persistent login sessions (recommended).
		app.use(passport.initialize());
		app.use(passport.session());

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
	}
	
	return module;
};