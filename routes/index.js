var express = require('express');
var router = express.Router();

// route middleware that will happen on every request: here we log the requests happening
router.use(function(req, res, next) {

	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing and go to the route
	next();	
});

//router.use('*', 
////requireAuthentication,
//function(req, res) {
//	res.render('index', { title: 'requireAuthentication' });
//},
////loadUser);
//function(req, res) {
//	res.render('index', { title: 'loadUser' });
//} 
//);

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Home' });
});

/* Register page. */
router.use('/register', function(req, res) {
	res.render('register', { title: 'Register' });
});

/* Login page. */
router.use('/login', function(req, res) {
	res.render('login', { title: 'Login' });
});

/* Logout page. */
router.use('/logout', function(req, res) {
	
	res.render('logout', { title: 'Logout' });
});

/* IIIF image server */
router.get('/iiif-image/:identifier/:region/:size/:rotation/:quality.:format', function(req, res) {
	console.log(req.params);

	res.render('index', { title: 'Express' });
	//{scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
	//For example:
	//	http://www.example.org/image-service/abcd1234/full/full/0/default.jpg
});

/* metastack view */
//router.get('/metastack:name') {
//	
//}



/* GET metaStack */
router.get('/metaStack/:name', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' })
});

module.exports = router;
