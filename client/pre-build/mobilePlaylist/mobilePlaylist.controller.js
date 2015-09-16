app.controller('MobilePlaylistController', function($scope, $http, playlistFactory, roomKey) {
  	$scope.search;
 	$scope.results;
 	$scope.playlist = [];
 	$scope.room;
 	$scope.sortable = false;
 	$scope.addedIndex = [];
 	console.log('resolve roomKey', roomKey)
  	console.log(window.location.origin)
	var socket = io(window.location.origin+'/nsp');
	socket.emit('joinRoomAsMobile', {roomKey:roomKey, socketId : socket.id})

	socket.on('connect', function () {
		console.log('connecttttt')
	})
	console.log('EQUAL?',socket.id)

	socket.on('deviceConnected', function(roomName){
		console.log('This device is now connected to room ', roomName);
		$scope.room = roomName;
		// $scope.$apply();
	})
	socket.on('addedSong', function(song){
		console.log('adding song!', song)
		$scope.socketAddToPlaylist(song);
		$scope.$apply();
	})
	socket.on('playlistData', function(playlist){
		console.log('playlist', playlist)
		$scope.playlist = playlist;
		$scope.$apply();
	})
	socket.on('removedSong', function(index){
		console.log('removing song at ', index)
		$scope.removeSong(index);
		$scope.$apply();
	})
	socket.on('sortedPlaylist', function(index){
		console.log(index)
		var moving = $scope.playlist.splice(index[0],1)[0]
		console.log('moving',moving)
		$scope.playlist.splice(index[1], 0, moving)
		console.log($scope.playlist)
		$scope.$apply();
	})

 	$scope.test = function(){
 		console.log('testing')
 		socket.emit('test', {room:$scope.room})
 	};
 	$scope.onSorted = function(sortedPlaylist, indexFrom, indexTo){
 		console.log(indexFrom, indexTo)
		localStorage.setItem(1, JSON.stringify(sortedPlaylist))
		socket.emit("sortingPlaylist", {room:$scope.room, index:[indexFrom, indexTo]})
	};
 	$scope.submit = function(){
 		$scope.addedIndex = [];
  		console.log('clicked!')
  		playlistFactory.searchSpotify($scope.search)
  			.then(function(results){
  				console.log('waited', results)
  				$scope.results = results;
  			})
 	};
 	$scope.socketAddToPlaylist = function(song){
 		console.log(song);
 		$scope.playlist.push(song)
 		// socket.emit('addSong', song)
 	};
 	$scope.addToPlaylist = function(song, index){
 		console.log(song);
 		$scope.playlist.push(song)
 		socket.emit('addSong', {room: $scope.room, song:song})
 		$scope.addedIndex.push(index);
 	};
 	$scope.playSong = function(song){
 		socket.emit('play', {song:song, room:$scope.room})
 	};
 	$scope.removeSong = function(index){
 		$scope.playlist.splice(index,1)
 	};
 	$scope.clearSearch = function(){
 		$scope.search = '';
 		$scope.results = null;
 		$scope.addedIndex = [];
 	};
 	$scope.itemOnLongPress = function(id) {
		console.log('Long press');
		$scope.sortable = true;
	};
	$scope.itemOnTouchEnd = function(id) {
		$scope.sortable = false;
		console.log('Touch end');
	};
});

app.filter('trusted', ['$sce', function($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
}]);