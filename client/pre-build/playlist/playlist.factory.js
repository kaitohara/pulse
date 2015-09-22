app.factory('playlistFactory', function ($http){
	return {
		searchSpotify: function(query){
			return $http.post('/api/search', {query:query})
				.then(function(response){
					return response.data;
				})
		}
	}
})