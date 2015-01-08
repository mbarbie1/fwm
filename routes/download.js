var express = require('express'); 
var router = express.Router(); 
var util = require("util"); 
var fs = require("fs"); 
var path = require("path"); 

router.get('*', function(req, res){
  var file = path.join(__dirname, '..', req.params[0]);
  console.log('The file to download: '+ file);
  res.download(file);
});

module.exports = router;
