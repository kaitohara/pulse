app.controller('HomeController', function($scope, $http, $state) {
	
	$scope.startPlaylist = function(){
		console.log('starting Playlist')
		
		localStorage.removeItem('key');
	};
	
	$scope.joinPlaylist = function(){
		// console.log(window.location.origin)
		// var socket = io(window.location.origin+'/nsp');
		
		// $state.go('mobilePlaylist')
	};
	$scope.test;
});
