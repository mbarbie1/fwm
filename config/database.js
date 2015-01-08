module.exports = function database() {

	var module = {};

	var sqlite3 = require('sqlite3').verbose();

	//////////////////////////////    THE DATABASE   //////////////////////////////////////////
	var db = new sqlite3.Database('./usersdb.sqlite');
	module.db = db;

	//////////////////////////////    WHITELIST OF USERS   //////////////////////////////////////////
	module.initWhiteListTable = function(tableName) {
		db.serialize( function() {
			var sqlQuery = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' '
				+ '( ' + 'id ' + 'INTEGER PRIMARY KEY, '
				+ 'email ' + 'TEXT, '
				+ 'permission ' + 'TEXT )';
			db.run( sqlQuery );
		});
	};
	
	//////////////////////////////     GMAIL SMTP TOKEN     //////////////////////////////////////////
	module.initTokenTable = function(tableName) {
		db.serialize( function() {
			var sqlQuery = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' '
				+ '( ' + 'id ' + 'INTEGER PRIMARY KEY, '
				+ 'user ' + 'TEXT, '
				+ 'clientId ' + 'TEXT, '
				+ 'clientSecret ' + 'TEXT, '
				+ 'refreshToken ' + 'TEXT, '
				+ 'token ' + 'TEXT )';
			db.run( sqlQuery );
		});
	};

	//////////////////////////////     USER CREDENTIALS     //////////////////////////////////////////
	// The table needs the columns (id, email, username, password (which is the hash of the real password), salt)
	module.initUsersTable = function(tableName) {
		db.serialize( function() {
			var sqlQuery = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' '
				+ '( ' + 'id ' + 'INTEGER PRIMARY KEY, '
				+ 'email ' + 'TEXT, '
				+ 'username ' + 'TEXT, '
				+ 'password ' + 'TEXT, '
				+ 'salt ' + 'TEXT, '
				+ 'valid ' + 'INTEGER, '
				+ 'permission ' + 'TEXT )';
			db.run( sqlQuery );
		});
	};


	
	return module;
};
