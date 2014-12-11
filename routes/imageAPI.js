var express = require('express');
var router = express.Router();

/* IIIF image server */
router.get('/iiif-image/:identifier/:region/:size/:rotation/:quality.:format', function(req, res) {
	console.log(req.params);

	res.render('index', { title: 'Express' });
	//{scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
	//For example:
	//	http://www.example.org/image-service/abcd1234/full/full/0/default.jpg
});

/* GET metaStack */
router.get('/metaStack/:name', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' })
});

module.exports = router;
