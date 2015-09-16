var router = require('express').Router();

// var controller = require('./nodemodule.controller.js');

module.exports = router;

router.get('/', function(req, res, next){
	console.log('searching!')
})

// router.get('/', controller.index);



// router.post('/', controller.create);
