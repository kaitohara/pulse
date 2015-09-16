app.factory('homeFactory', function ($http){
	return {
		searchSpotify: function(query){
			console.log('sending search to backend', query)
			return $http.post('/api/search', {query:query})
				.then(function(response){
					return response.data;
				})
		}
	}
})