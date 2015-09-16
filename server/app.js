var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var chalk = require('chalk');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');

var server = require('http').createServer(app);

// server.on('request', app)

// var io = require('socket.io')(server);

var clientPath = path.join(__dirname, '../client');
var buildPath = path.join(__dirname, '../client/build');    // for gulped files
var indexHtmlPath = path.join(__dirname, './index.html');
var nodePath = path.join(__dirname, '../node_modules');
var imagePath = path.join(__dirname, './images');
/* 
Meaniscule doesn't use Bower by default. To use Bower,
uncomment the following line and the related `app.use` line below.
*/
// var bowerPath = path.join(__dirname, '../bower_components');

var io = require('socket.io')(server);

var nsp = io.of('/nsp')
var rooms = [];
var roomsObj = {};
var room;
nsp.on('connection', function (socket){

  socket.on('createRoom', function (data){
    var roomKey = generateRoomKey();
    while(roomsObj[roomKey]){
      roomKey = generateRoomKey();
    }
    if (!roomsObj[roomKey]){
      roomsObj[roomKey] = data.roomName;
    }
    socket.join(roomsObj[roomKey])
    room = roomsObj[roomKey];
    socket.emit('createdRoom', roomKey)
  })

  socket.on('joinAttempt', function(roomKey){
    if (roomsObj[roomKey]){
      socket.emit('joinSuccess', roomsObj[roomKey])
    } else {
      socket.emit('joinFailure', 'bad')
    }
  })

  socket.on('joinRoom', function (data){
    if (!roomsObj[data.roomKey]){
      roomsObj[data.roomKey] = data.roomName;
    }
    var roomToJoin = roomsObj[data.roomKey]
    room = roomsObj[data.roomKey];
    socket.join(roomToJoin)
    socket.broadcast.to(roomToJoin).emit('userJoined', socket.id);
    socket.emit('deviceConnected', roomToJoin);
  });
  socket.on('joinRoomAsMobile', function (data){
    var roomToJoin = roomsObj[data.roomKey]
    socket.join(roomToJoin)
    socket.broadcast.to(roomToJoin).emit('userJoined', socket.id);
    socket.emit('deviceConnected', roomToJoin)
  });
  socket.on('playlist', function(data){
      socket.broadcast.to(data.socketId).emit('playlistData', data.playlist);
  })
  socket.on('test', function(data){
    socket.broadcast.to(data.room).emit('message', 'cool game');
  })
  socket.on('addSong', function(data){
    socket.broadcast.to(data.room).emit('addedSong', data.song);
  })
  socket.on('removeSong', function(data){
    socket.broadcast.to(data.room).emit('removedSong', data.index)
  })
  socket.on('play', function(data){
    socket.broadcast.to(data.room).emit('playSong', data.song)
  })
  socket.on('sortingPlaylist', function(data){
    socket.broadcast.to(data.room).emit('sortedPlaylist', data.index)
  })
});

function generateRoomKey(){
  var randomAdjs = ['old', 'red', 'blue', 'green', 'odd', 'nice', 'quick', 'short']
  var randomWords = ['tire','code','rock','road','cat','dog','bird','car','fox']
  var randomOne = randomAdjs[Math.floor(Math.random()*randomAdjs.length)];
  var randomTwo = randomWords[Math.floor(Math.random()*randomWords.length)];
  return randomOne + '-' + randomTwo;
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(clientPath));
app.use(express.static(buildPath));
app.use(express.static(nodePath));
app.use(express.static(imagePath));
// app.use(express.static(bowerPath));



/* 
Provides a 404 for times 
Credit to `fsg` module for this one!
*/
app.use(function (req, res, next) {

  if (path.extname(req.path).length > 0) {
    res.status(404).end();
  } else {
    next(null);
  }

});

app.use('/api/search/', require('./api/search'))

//// Index/Home
app.use('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, './index.html'));
});

// Errors
//// Not found
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//// Server issues
app.use(function(err, req, res, next) {
  res.sendStatus(err.status || 500);

});


module.exports = {
  app: app,
  server: server
}

