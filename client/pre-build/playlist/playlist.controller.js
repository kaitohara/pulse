app.controller('PlaylistController', function($scope, $http, playlistFactory, $window, $modal, $rootScope) {
  	$scope.search;
 	$scope.results;
 	$scope.playlist = [];
 	var playlistPreSwap = [];
 	$scope.room;
 	$scope.key;
 	
 	if (localStorage.getItem(1)){
 		$scope.playlist = JSON.parse(localStorage.getItem(1));
 		playlistPreSwap = JSON.parse(localStorage.getItem(1))
 	}
 	$scope.slideDown;
 	$scope.testdata = ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "1.10", "1.11", "1.12", "1.13", "1.14", "1.15", "1.16", "1.17", "1.18", "1.19"]
  	var socket = io(window.location.origin+'/nsp');

	socket.on('connect', function () {
		if (!localStorage.getItem('key')){
			socket.emit('createRoom', {roomName: socket.id})	
		} else {
			var keyStorage = JSON.parse(localStorage.getItem('key'))
			socket.emit('joinRoom', {roomKey:keyStorage.roomKey, roomName: socket.id})
			$scope.key = $rootScope.key = keyStorage.roomKey;
		}
	})

	socket.on('deviceConnected', function(roomName){
		$scope.room = roomName;
		$scope.$apply();
	})

	socket.on('createdRoom', function(roomKey){
		localStorage.setItem('key', JSON.stringify({roomKey}))
		$scope.key = $rootScope.key = roomKey;
		$scope.$apply();
	})
	socket.on('message', function(){
		console.log('heard it!')
	})
	socket.on('addedSong', function(song){
		$scope.socketAddToPlaylist(song);
		$scope.$apply();
	})
	socket.on('userJoined', function(socketId){
		socket.emit('playlist',{playlist: $scope.playlist, socketId: socketId})
	})

	socket.on('playSong', function(song){
		$scope.playSong(song);
		$scope.$apply();
	})

	socket.on('sortedPlaylist', function(index){
		var moving = $scope.playlist.splice(index[0],1)[0]
		$scope.playlist.splice(index[1], 0, moving)
		localStorage.setItem(1,JSON.stringify($scope.playlist))
		$scope.onSorted(null, index[0], index[1])
		$scope.$apply();
	});

	$("#player").bind('ended', function(){
    	playNext($scope.playing);
	});

	$scope.playing;

 	function generateKey(){
 		var randomWords = ['tire','code','rock','card','road']
 		var key = randomWords[Math.ceil(Math.random()*randomWords.length)]
 		$scope.key = $rootScope.key = key;
 		return key
 	};

 	function playNext(index){
 		var index = index+1;
 		if (index >= $scope.playlist.length){
 			$scope.playing = null;
 		} else {
	 		$scope.playSong($scope.playlist[index], index);
 		}
 		$scope.$apply();
 	};
 	$scope.openSlide = function(){
 		$scope.slideDown = true;
 	}
 	$scope.closeSlide = function(){
 		$window.onclick = null;
 		$scope.slideDown = false;
 	}
 	$scope.onSorted = function(sortedPlaylist, indexFrom, indexTo){
 		if (sortedPlaylist) localStorage.setItem(1, JSON.stringify(sortedPlaylist));
		if ($scope.playing === indexFrom){
			$scope.playing = indexTo;
		} else if (indexFrom < $scope.playing && indexTo <= $scope.playing){
			$scope.playing -= 1;
		} else if (indexFrom < $scope.playing && indexTo >= $scope.playing){
			$scope.playing -= 1;
		} else if (indexFrom > $scope.playing && indexTo <= $scope.playing){
			$scope.playing += 1;
		}
		if (sortedPlaylist) socket.emit("sortingPlaylist", {room:$scope.room, index:[indexFrom, indexTo]});
	};

 	$scope.submit = function(){
  		//set loader gif = true
  		playlistFactory.searchSpotify($scope.search)
  			.then(function(results){
  				// set loader gif = false
  				$scope.results = results;
  				$scope.openSlide();
  			})
 	};
 	$scope.socketAddToPlaylist = function(song){
 		$scope.playlist.push(song)
 		playlistPreSwap.push(song)
 		var playlist;
 		if (localStorage.getItem(1)){
 			playlist = JSON.parse(localStorage.getItem(1));
 			playlist.push(song)
 		} else {
 			playlist = [song]
 		}
 		localStorage.setItem(1, JSON.stringify(playlist))
 	};
 	$scope.addToPlaylist = function(song){
 		$scope.playlist.push(song)
 		playlistPreSwap.push(song)
 		var playlist;
 		if (localStorage.getItem(1)){
 			playlist = JSON.parse(localStorage.getItem(1));
 			playlist.push(song)
 		} else {
 			playlist = [song]
 		}
 		localStorage.setItem(1, JSON.stringify(playlist))
 		socket.emit('addSong', {song:song, room:$scope.room})
 	};
 	$scope.playSong = function(song, index){
 		var index = index || 0;
 		var player = document.getElementById('player');
 		var sourceMp3 = document.getElementById('player');
 		sourceMp3.src = song.preview_url;
 		player.load();
 		player.play();
 		var image = document.getElementById('playingSong');
 		image.src = song.album.images[0].url;
 		$scope.playing = index;
 		socket.emit('playingSong',{song:song, room:$scope.room})
 	};
 	$scope.removeSong = function(index){
 		$scope.playlist.splice(index,1)
 		playlistPreSwap.splice(index,1)
 		var playlist = JSON.parse(localStorage.getItem(1));
 		playlist.splice(index, 1)
 		localStorage.setItem(1, JSON.stringify(playlist))
 		socket.emit('removeSong', {index:index, room: $scope.room})
 	};
 	$scope.openModal = function(){
 		var modalInstance = $modal.open({
 			animation: $scope.animationsEnabled,
 			templateUrl: '/pre-build/modal/modal.html',
 			controller: 'ModalController'
 		});
 	}
 	$scope.blur = function(index){
 		$scope.blurPlus = index;
 	};
 	$scope.unblur = function(index){
 		$scope.blurPlus = false;
 	};
 	$scope.clearSearch = function(){
 		$scope.slideDown = false;
 		setTimeout(function(){
 			$scope.search = '';
 			$scope.results = null;
 		}, 800)
 	};

 	

	$(document).mouseup(function (e)
	{
	    var container = $(".slider");
	    if (!container.is(e.target) 
	        && container.has(e.target).length === 0)
	    {
	        $scope.slideDown = false;
	        $scope.$apply();
	    }
	});
});

app.filter('trusted', ['$sce', function($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
}]);
