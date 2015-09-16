app.config(function($stateProvider){
	$stateProvider.state('mobilePlaylist', {
		url: '/',
		params: {'roomKey':null},
		templateUrl: '/pre-build/mobilePlaylist/mobilePlaylist.html',
		controller: 'MobilePlaylistController',
		resolve: {
			roomKey: function($stateParams){
				return $stateParams.roomKey;
			}
		}
	});
});