app.factory('authFactory', function ($http){
	return {
		authenticate: function(query){
			return $http.get('/auth/spotify')
				.then(function(response){
					return response.data;
				})
		}
	}
})