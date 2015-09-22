app.controller('HomeController', function($scope, $http, $state) {
	
	$scope.startPlaylist = function(){
		localStorage.removeItem('key');
	};
	
	$scope.joinPlaylist = function(){
	};
	$scope.test;
});
