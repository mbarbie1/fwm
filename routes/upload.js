var express = require('express'); 
var router = express.Router(); 
var util = require("util"); 
var fs = require("fs"); 

router.get('/:username', function(req, res) { 
	res.render("users/data", {title: "Data upload", user: {'username': req.params.username}}); 
});

router.post('/:username', function(req, res, next){ 
	if (req.files) { 
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
});
module.exports = router;
