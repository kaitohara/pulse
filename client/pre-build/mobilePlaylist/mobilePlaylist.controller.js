app.controller('MobilePlaylistController', function($scope, $http, playlistFactory, roomKey) {
  	$scope.search;
 	$scope.results;
 	$scope.playlist = [];
 	$scope.room;
 	$scope.sortable = false;
 	$scope.addedIndex = [];
 	$scope.showPlaylist = true;
	var socket = io(window.location.origin+'/nsp');
	socket.emit('joinRoomAsMobile', {roomKey:roomKey, socketId : socket.id})

	socket.on('connect', function () {
	})

	socket.on('deviceConnected', function(roomName){
		$scope.room = roomName;
	})
	socket.on('addedSong', function(song){
		$scope.socketAddToPlaylist(song);
		$scope.$apply();
	})
	socket.on('playlistData', function(playlist){
		$scope.playlist = playlist;
		$scope.$apply();
	})
	socket.on('removedSong', function(index){
		$scope.removeSong(index);
		$scope.$apply();
	})
	socket.on('sortedPlaylist', function(index){
		var moving = $scope.playlist.splice(index[0],1)[0]
		$scope.playlist.splice(index[1], 0, moving)
		$scope.$apply();
	})
	socket.on('displaySong', function(song){
		var image = document.getElementById('playingSong');
		image.src = song.album.images[0].url;
		$scope.playing = song;
		$scope.$apply();
	})
 	$scope.test = function(){
 		socket.emit('test', {room:$scope.room})
 	};
 	$scope.onSorted = function(sortedPlaylist, indexFrom, indexTo){
		localStorage.setItem(1, JSON.stringify(sortedPlaylist))
		socket.emit("sortingPlaylist", {room:$scope.room, index:[indexFrom, indexTo]})
	};
 	$scope.submit = function(){
 		$scope.addedIndex = [];
  		playlistFactory.searchSpotify($scope.search)
  			.then(function(results){
  				$scope.results = results;
  			})
 	};
 	$scope.socketAddToPlaylist = function(song){
 		$scope.playlist.push(song)
 		// socket.emit('addSong', song)
 	};
 	$scope.addToPlaylist = function(song, index){
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
		$scope.sortable = true;
	};
	$scope.itemOnTouchEnd = function(id) {
		$scope.sortable = false;
	};
	$scope.toggleSearch = function(){
		$scope.showSearch = true;
		$scope.showPlaylist = false;
		$scope.showCurrent = false;
	};
	$scope.togglePlaylist = function(){
		$scope.showSearch = false;
		$scope.showPlaylist = true;
		$scope.showCurrent = false;
	};
	$scope.toggleCurrent = function(){
		$scope.showSearch = false;
		$scope.showPlaylist = false;
		$scope.showCurrent = true;
	};
});

app.filter('trusted', ['$sce', function($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
}]);