app.controller('MobileHomeController', function($scope, $http, $state) {
	
	$scope.startPlaylist = function(){
	};
	var socket = io(window.location.origin+'/nsp');
	socket.on('joinSuccess', function(roomName){
		var roomKey = $scope.keyOne + '-' + $scope.keyTwo;
		$state.go('mobilePlaylist', {'roomKey':roomKey})
	})
	$scope.joinFail = false;
	socket.on('joinFailure', function(){
		$scope.joinFail = true;
		$scope.$apply();
	})
	$scope.joinPlaylist = function(){
		var roomKey = $scope.keyOne + '-' + $scope.keyTwo;
		socket.emit('joinAttempt', roomKey)
	};
	$scope.keyOne;
	$scope.keyTwo;
});
