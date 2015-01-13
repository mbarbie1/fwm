var express = require('express'); 
var router = express.Router(); 
var path = require('path'); 

router.get('/', function(req, res) { 
	res.render("users/imageViewer_node.jade", {
			nonavbar: true,
			title: "Image Viewing",
			user: {'username': req.user.username},
			images: {'file': 'todo: '}
	}); 
});

/* IIIF image server */
router.get('/iiif-image/:identifier/:region/:size/:rotation/:quality.:format', function(req, res) {
	console.log(req.params);

	var img = 	'todo';
	res.send();
	//{scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
	//For example:
	//	http://www.example.org/image-service/abcd1234/full/full/0/default.jpg
});


module.exports = router;
