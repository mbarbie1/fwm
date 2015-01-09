var express = require('express');
//var app = express();
var busboy = require('connect-busboy');
//app.use(busboy());

var multer = require('multer');
var path = require('path');
var fs = require('fs-extra');
var util = require("util"); 
var router = express.Router();
//var base = process.env.PWD;
var base = path.resolve('.');
var dataCommand = 'data'
	, downloadCommand = 'download'
	, uploadCommand = 'upload'
	, createDirCommand = 'createDir'
	, deleteCommand = 'delete'
	, showFileCommand = 'showText'
	, viewImageCommand = 'view';
var normalizeUrl = require('normalizeurl');
var joinURI = function( pathA, pathB ) {
	return [pathA.replace(/^\/|\/$/g,""), pathB.replace(/^\/|\/$/g,"")].join("/");
}

var imageUrl = path.join(dataCommand, 'images/original');
var uploadImageFolder = path.join( base, imageUrl);
var uploadDataFolder = path.join( base, dataCommand);
//
var fb = require('../middleware/fileBrowser.js')( dataCommand, {'icons': true, 'view': 'details','stylesheet':'./middleware/public/style.css' } );


// route middleware that will happen on every request: here we log the requests happening
router.use( function(req, res, next) {
	console.log('happens on every request: ');

	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing and go to the route
	next();	
});

/* GET home page. */
//router.get('/', function(req, res) {
//	console.log('GET /');
//	res.render('index', { title: 'Express' });
//});

/* GET image download file. */
router.get('/download', function(req, res) {
	console.log('GET /download');
	var file = path.join( uploadImageFolder, req.query.file );
	res.download(file);
});

/* USE delete file/folder. */
router.use('/delete', function(req, res, next) {

 	console.log('USE /delete/');
	console.log('  The url = %j', req.url);
	
	var file = path.join( base, dataCommand, req.url );
	var reqUrl = normalizeUrl(joinURI( joinURI(dataCommand, req.url), '..') );
	console.log('reqUrl = ' + reqUrl);
	if ( !fs.lstatSync( file ).isDirectory()  ) {
		fs.unlink( file, function (err) {
			if (err) throw err;
			console.log('Deleted: ', file);
			res.redirect( reqUrl );
		});
	} else {
		fs.remove(file, function (err) {
			if (err) throw err;
			console.log('Deleted dir: ', file);
			res.redirect( reqUrl );
		});
	}
});

/* USE image download file. */
router.use('/data', function(req, res, next) {

 	console.log('USE /data/');
	console.log('  The url = %j', req.url);
	
	var file = path.join( base, dataCommand, req.url );
	if ( !fs.lstatSync( file ).isDirectory()  ) {
		console.log('Downloading: ', file);
		res.download(file);
	} else {
		console.log('Not a file, we cannot download it (serve-index will handle it): ', file);
		next();
	}
});

router.use('/data', function(req, res, next) {

 	console.log('USE /data/');
	console.log('  The url = %j', req.url);
	
	fb.indexHtml( req, function (err, htmlFb) {
		if (err) {
			res.render('error', { 'error': err });
		} else {
			// TODO
			req.session.user = 'mbarbie1';
			res.render('users/data', { 'htmlFb': htmlFb, user:{'username':req.session.user} });
		}
	});
});

/* POST file to upload page. */
router.post('/upload', busboy(), function(req, res){
	console.log('Inside POST /upload');

	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
	//, encoding, mimetype
	//	console.log('file event');
	//	console.log('fieldname');
	//	console.log(fieldname);
	//	console.log('file');
	//	console.log(file);
	//	console.log('filename');
	//	console.log(filename);
	//	console.log('encoding');
	//	console.log(encoding);
	//	console.log('mimetype');
	//	console.log(mimetype);
		//console.log('Current directory: ' + process.cwd());
		console.log(path.join(uploadImageFolder, filename));
		fstream = fs.createWriteStream( path.join(uploadImageFolder, filename) );
		file.pipe(fstream);
		fstream.on('close', function () {
			res.redirect('back');
		});
	});
});

/* 	if (req.files) { 
		console.log(util.inspect(req.files));
		if (req.files.myFile.size === 0) {
		            return next(new Error("select a file, please"));
		}
		fs.exists(req.files.myFile.path, function(exists) { 
			if(exists) { 
				res.render("users/data", {title: "Data transfer succesful", user: {'username': req.params.username}}); 
			} else { 
				res.render("users/data", {title: "Data transfer failure, please retry", user: {'username': req.params.username}}); 
			} 
		}); 
	} 
 */

module.exports = router;
