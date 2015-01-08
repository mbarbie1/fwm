module.exports = function filebrowser() {

	var module = {};

	var fs = require('fs');
	var path = require('path');
	var async = require('async');
	var util = require('util');
	var mime = require('mime');
	var url = require('url');


	module.iconDictionary = {
		'unknown': '/public/images/icons/unknown.png',
		'text': '/public/images/icons/text.png',
		'image': '/public/images/image.png',
		'video': '/public/images/icons/video.png',
		'audio': '/public/images/icons/audio.png',
	}

	module.loadIconDictionary = function( filePath ) {
		module.iconDictionary = require( filePath );
	}

	module.mimeTypeIcon = function ( mimeType, iconDictionary ) {

		var iconPath = iconDictionary[mimeType];

		if ( iconPath ) {
			// When the mimeType has a known corresponding icon: return the path to the icon-image 
			return iconPath;
		} else {
			iconPath = iconDictionary[mimeType.split('/')[0]]
			if ( iconPath ) {
				// One of the generic icons: image, audio, video: return the path to the generic icon-image 
				return iconPath;
			} else {
				// No icon found: return the path to the 'unknown' icon-image 
				return iconDictionary['unknown'];
			}
		}
		
	}

	// var dataUri = base64Image("./iconFolder.png");
	// console.log(dataUri);
	module.base64Image = function (src) {
		var data = fs.readFileSync(src).toString("base64");
		return util.format("data:%s;base64,%s", mime.lookup(src), data);
	}

	module.trimEndSlash = function (str) {
		return str.replace(/\/+$/,'');
	}
	module.trimBeginSlash = function (str) {
		return str.replace(/^\/+/,'');
	}

	module.trimBeginAndEndSlash = function (str) {
		console.log('Before trim: ' + str);
		var res = str.replace(/^\/+|\/+$/, '');
		console.log('After trim: ' + res);
		return res;
	}

	module.parentUrl = function (str) {
		console.log('Child url: ' + str);
		var res = str.replace(/[^\/]+$|[^\/]+\/$/, '');
		console.log('Parent url: ' + res);
		return res;
	}

	module.walk = function walk(dir, options, done) {

		if ( !options ) {
			options = {
				'node':true,
				'name':true,
				'path':true,
				'type':true,
				'url':true,
				'size':true,
				'atime':true,
				'owner':true,
				'permission': {
					'user': {'read':true, 'write':true},
					'group': {'read':true, 'write':false},
					'all': {'read':false, 'write':false}
				}
			};
		}
		var tree = [];
		var pathName;
		fs.readdir( dir, function(err, names) {
			if (err) return done(err);
			// number of branches to investigate
			var todo = names.length;
			if (!todo) done( null, tree );
			// for each of the branches check whether it is a file or a dir
			names.forEach( function( name ) {
				pathName = path.join(dir, name);
				fs.stat( pathName, function(err, stats) {
					pathName = path.join(dir, name);
					if (err) {
						console.log(err); done(null, tree);
					}
					if ( stats && stats.isDirectory() ) {
						console.log(name + ' is a dir: ' + stats.isDirectory() );
						walk( pathName, options, function(err, res){
							tree = tree.concat( { 'type':'folder', 'name':name, 'node':res, 'path': pathName} );
							if (!--todo) done(null, tree);
						});
					} else {
						console.log(name + ' is a file: ' + stats.isFile() );
						tree.push( { 'type':'file', 'name':name, 'path': pathName } );
						if (!--todo) done(null, tree);
					}
				});
			});
		});
	}

	module.listDir = function(dir, options, done) {

		if ( !options ) {
			return done(err);
/* 			options = {
				'name':true,
				'path':true,
				'type':true,
				'url':true,
				'baseUrl': '/' + module.trimBeginAndEndSlash(req.params[0]),
				'listUrl': '/list/' + module.trimBeginAndEndSlash(req.params[0]),
				'parentUrl': '/list/' + module.parentUrl(req.params[0]),
				'downloadUrl': '/download/' + module.trimBeginAndEndSlash(req.params[0]),
				'size':true,
				'atime':true,
				'owner':true,
				'permission': {
					'user': {'read':true, 'write':true},
					'group': {'read':true, 'write':false},
					'all': {'read':false, 'write':false}
				}
			};
 */		}
		var list = [];
		var el;
		var pathName;
		el = { 'type':'folder', 'name':'..', 'path': dir, 'url':options.parentUrl};
		list.push(el);
		fs.readdir( dir, function(err, names) {
			if (err) return done(err);
			// number of names in the folder
			var todo = names.length;
			if (!todo) done( null, list );
			// for each of the names check whether it is a file or a dir
			names.forEach( function( name ) {
				pathName = path.join(dir, name);
				fs.stat( pathName, function(err, stats) {
					pathName = path.join(dir, name);
					if (err) {
						console.log(err); done(null, list);
					}
					if ( stats && stats.isDirectory() ) {
						console.log(name + ' is a dir: ' + stats.isDirectory() );
						el = { 'type':'folder', 'name':name }; //, 'path': pathName};
						console.log('innerfunction: base url: ' + options.baseUrl);
						el.url = module.trimEndSlash(options.listUrl) + '/' + module.trimBeginAndEndSlash(name);
						console.log('innerfunction: url: ' + el.url);
						list = list.concat( el );
						if (!--todo) done(null, list);
					} else {
						console.log(name + ' is a file: ' + stats.isFile() );
						el = { 'type':'file', 'name':name, 'mimeType': mime.lookup(name)}; //, 'path': pathName };
						el.url = module.trimEndSlash(options.downloadUrl) + '/' + module.trimBeginAndEndSlash(name);
						console.log('innerfunction: url: ' + el.url);
						list.push( el );
						if (!--todo) done(null, list);
					}
				});
			});
		});
	}

	module.getFileInfo = function(dirPath, name, done) {

		fs.stat( path.join( dirPath, name ), function(err, stats) {
			if (err) {
				console.log( err )
			}
			var el = {};
			el.name = name;
			el.type = 'unknown';
			el.date = stats.atime;
			el.owner = stats.uid;
			el.size = stats.blockSize;
			if ( stats.isDirectory ) {
				el.type = 'dir'
			}
			if ( stats.isFile ) {
				el.type = 'file'
			}
			done(err, el);
		});
	}

	module.getMrJsonHeaders = function() {

		var headers = [
			{
				heading: "",
				data: "type", // see how this links to the json object further down
				type: "img", // can be string, int, float, datetime
				sortable: true, // is the field sortable (optional defaults to false)
				starthidden: false // should the field be hidden when loaded (optional defaults to false)
			},
			{
				heading: "Name",
				data: "name", // see how this links to the json object further down
				type: "url", // can be string, int, float, datetime
				sortable: true, // is the field sortable (optional defaults to false)
				starthidden: false // should the field be hidden when loaded (optional defaults to false)
			},
	/* 		{
				heading: "Size",
				data: "size", // see how this links to the json object further down
				type: "int", // can be string, int, float, datetime
				sortable: true, // is the field sortable (optional defaults to false)
				starthidden: false // should the field be hidden when loaded (optional defaults to false)
			}, */
	/* 		{
				heading: "Owner",
				data: "owner", // see how this links to the json object further down
				type: "string", // can be string, int, float, datetime
				sortable: true, // is the field sortable (optional defaults to false)
				starthidden: false // should the field be hidden when loaded (optional defaults to false)
			}, */
	/* 		{
				heading: "Date",
				data: "date", // see how this links to the json object further down
				type: "datetime", // can be string, int, float, datetime
				sortable: true, // is the field sortable (optional defaults to false)
				starthidden: false // should the field be hidden when loaded (optional defaults to false)
			} */
		];
		
		return headers;

	}

	return module;
};

// EXAMPLES

/* Walk the directory recursively. */
/* 
	var options = {
		'node':true,
		'name':true,
		'path':true,
		'type':true,
		'url':true,
		'size':true,
		'atime':true, 
		'owner':true,
		'permission': {
			'user': {'read':true, 'write':true},
			'group': {'read':true, 'write':false},
			'all': {'read':false, 'write':false}
		}
	};
	
	walk(dirPath, options, function(err, tree) {
		if (err) {
			console.log(err);
			throw err;
		}
		console.log('The tree = ' + JSON.stringify(tree) );
	});
 */
 
/* Get the list of files and folders in a directory. */

/* 
	var fb = require("this module")

	var options = {
		'name':true,
		'path':true,
		'type':true,
		'url':true,
		'baseUrl': '/' + fb.trimBeginAndEndSlash(req.params[0]),
		'listUrl': '/list/' + fb.trimBeginAndEndSlash(req.params[0]),
		'parentUrl': '/list/' + fb.parentUrl(req.params[0]),
		'downloadUrl': '/download/' + fb.trimBeginAndEndSlash(req.params[0]),
		'size':true,
		'atime':true,
		'owner':true,
		'permission': {
			'user': {'read':true, 'write':true},
			'group': {'read':true, 'write':false},
			'all': {'read':false, 'write':false}
		}
	};
	
	listDir(dirPath, options, function(err, list) {
		if (err) {
			console.log(err);
			throw err;
		}
		console.log('The list = ' + JSON.stringify(list) );
	});
 */

