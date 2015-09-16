app.controller('MobileHomeController', function($scope, $http, $state) {
	
	$scope.startPlaylist = function(){
		console.log('starting Playlist')
	};
	var socket = io(window.location.origin+'/nsp');
	console.log('socket.id', socket)
	socket.on('joinSuccess', function(roomName){
		// console.log('Join Success')
		console.log('roomName', roomName)
		var roomKey = $scope.keyOne + '-' + $scope.keyTwo;
		$state.go('mobilePlaylist', {'roomKey':roomKey})
	})
	$scope.joinFail = false;
	socket.on('joinFailure', function(){
		$scope.joinFail = true;
		console.log('Join Failed')
		$scope.$apply();
	})
	$scope.joinPlaylist = function(){
		// console.log(window.location.origin)
		// var socket = io(window.location.origin+'/nsp');
		console.log('joining playlist')
		var roomKey = $scope.keyOne + '-' + $scope.keyTwo;
		socket.emit('joinAttempt', roomKey)
		// $state.go('mobilePlaylist')
	};
	$scope.keyOne;
	$scope.keyTwo;
});
