var express = require('express'); 
var router = express.Router(); 

router.get('/:username', function(req, res) { 
	res.render("users/imageViewer_node", {
			scripts: [
					'users/public/external/external/jquery/jquery-1.11.1.js',
					'users/public/external/external/jquery-ui-1.11.1/jquery-ui.js',
					'users/public/external/openseadragon/openseadragon-bin-1.1.1/openseadragon.min.js',
					'users/public/external/openseadragonscalebar/openseadragon-scalebar.js'
			],
			title: "Image Viewing",
			user: {'username': req.params.username}
	}); 
});

/* router.post('/:username', function(req, res, next){ 
	if (req.files) { 
		console.log(util.inspect(req.files));
		if (req.files.myFile.size === 0) {
		            return next(new Error("select a file, please"));
		}
		fs.exists(req.files.myFile.path, function(exists) { 
			if(exists) { 
				res.render("users/dataView", {title: "Data transfer succesful", user: {'username': req.params.username}}); 
			} else { 
				res.render("users/dataManager_node2", {title: "Data transfer failure, please retry", user: {'username': req.params.username}}); 
			} 
		}); 
	} 
});
 */
module.exports = router;
