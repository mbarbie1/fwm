var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var async = require('async');
var util = require('util');
var url = require('url');
var fb = require('../config/filebrowser.js')();

var urlIconFolder = '/public/images/icons/folder.png';

/* GET directory listing. */

var listCommand = 'list';
var downloadCommand = 'download';

router.get('/:username*', function(req, res) {

	var dataDirectory = 'users/public/data';
	console.log('the request parameters, req.params[0] = ' + req.params[0]);
	var dirPath = path.join( __dirname, '..', dataDirectory, req.params[0]);
	console.log('The dirname: ' + __dirname);
	console.log('The dir requested: ' + req.params[0]);
	console.log('The dir requested: ' + fb.trimBeginAndEndSlash(req.params[0]));

	var options = {
		'name':true,
		'path':true,
		'type':true,
		'url':true,
		'baseUrl': '/' + fb.trimBeginAndEndSlash(req.params[0]),
		'listUrl': '/' + listCommand + '/' + req.params.username + '/' + fb.trimBeginAndEndSlash(req.params[0]),
		'parentUrl': '/' + listCommand + '/' + req.params.username + '/' + fb.parentUrl(req.params[0]),
		'downloadUrl': '/' + downloadCommand + '/' + dataDirectory + '/' + fb.trimBeginAndEndSlash(req.params[0]),
		'size':true,
		'atime':true,
		'owner':true,
		'permission': {
			'user': {'read':true, 'write':true},
			'group': {'read':true, 'write':false},
			'all': {'read':false, 'write':false}
		}
	};
	console.log('Base URL: ' + options.baseUrl)
	console.log('List URL: ' + options.listUrl)
	console.log('parent URL: ' + options.parentUrl)
	console.log('download URL: ' + options.downloadUrl)

	fb.listDir(dirPath, options, function(err, list) {
		if (err) {
			console.log(err);
			throw err;
		}
		console.log('The list = ' + JSON.stringify(list) );
		headers = fb.getMrJsonHeaders();
		folders = [];
		files = [];
		fb.loadIconDictionary('../views/users/iconDictionary.json');
		for (var i = 0; i < list.length; i++) {
			el = list[i];
			console.log('The type is ' + el.type)
			if (el.type == 'folder') {
				el.img = urlIconFolder;
				folders.push(el);
			}
			if (el.type == 'file') {
				el.img = fb.mimeTypeIcon( el.mimeType, fb.iconDictionary );
				files.push(el);
			}
		}
		res.render('users/dataBrowser_node', {
					user: {'username': req.params.username},
					'title': 'File Browser', 
					'folders': JSON.stringify(folders), 
					'files': JSON.stringify(files), 
					'headers': JSON.stringify(headers)
		});
	});

});

module.exports = router;
