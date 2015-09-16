var router = require('express').Router();
var request = require('request');

module.exports = router;

router.post('/', function(req, res, next){
	console.log('searching!', req.body.query)
	var requestUrl = 'https://api.spotify.com/v1/search?q=' + req.body.query + '&type=track'

	request({
		url: requestUrl,
		json: true
	}, function(error, response, body){
		if (!error && response.statusCode === 200) {
			console.log(body.tracks.items);
			res.status(200).send(body.tracks.items)
		} else {
			console.log("Error! ", err);
		}
	})
});