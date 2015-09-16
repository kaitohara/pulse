app.config(function($stateProvider){
	$stateProvider.state('playlist', {
		url: '/playlist',
		templateUrl: '/pre-build/playlist/playlist.html',
		controller: 'PlaylistController'
	});
});