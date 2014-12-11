module.exports = function (db, tableNameToken) {

	var module = {};

	var xoauth2 = require('xoauth2');
	var nodemailer = require('nodemailer');
	var smtpTransport = require('nodemailer-smtp-transport');	

	module.sendByGmail = function( sender, receiver, contentHtml, contentText, subject ) {
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
	}

	return module;
};