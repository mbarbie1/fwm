var express = require('express');
var path = require('path');
var router = express.Router();

//console.log(path.join(__dirname, 'users/public'));
//router.use(express.static(path.join(__dirname, 'users/public')));

var util = require("util"); 
var fs = require("fs"); 

/* router.get('/users/app/:app/:username', function(req, res) {
	console.log('Inside: user router');
	pageContent = 'public/'+req.params.app+'.html';
	console.log(pageContent);
	res.render('users/'+req.params.app, { 
			scripts: [
					'users/public/external/external/jquery/jquery-1.11.1.js',
					'users/public/external/external/jquery-ui-1.11.1/jquery-ui.js',
					'users/public/external/openseadragon/openseadragon-bin-1.1.1/openseadragon.min.js',
					'users/public/external/openseadragonscalebar/openseadragon-scalebar.js'
				]
			, 
			user: { 'username' : req.params.username},
			page: {'title':req.params.app, 'content':pageContent, 'htmlOrigin':'public'} 
		});
});
 */
/* GET users page */
router.get('/users/home/', function(req, res) {
	console.log('Inside: user router');
	res.render('users/home.jade', { scripts:[], user: { 'username' : req.user.username}, page: {'title':'User profile', 'content':'home' } } );
});

router.get('/box/', function(req, res) {
	res.render('users/box.jade', { scripts:[], user: { 'username' : req.user.username}, page: {'title':'User profile', 'content':'home' } } );
});


module.exports = router;
