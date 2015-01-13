var express = require('express'); 
var router = express.Router(); 
var path = require('path'); 

router.get('/', function(req, res) { 
	res.render("users/imageViewer_node.jade", {
			nonavbar: true,
			title: "Image Viewing",
			user: {'username': req.user.username}
			user: {'image': }
	}); 
});



module.exports = router;
