var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var chalk = require('chalk');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var compression = require('compression');

var server = require('http').createServer(app);
//setting up sockets
var io = require('socket.io')(server);

var nsp = io.of('/nsp')
var rooms = [];
var roomsObj = {};
var room;


var passport = require('passport')
var SpotifyStrategy = require('passport-spotify/lib/passport-spotify/index').Strategy;

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
    socket.emit('createdRoom', {roomKey:roomKey, room:room})
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
  //Communicate that a song has been added
  socket.on('addSong', function(data){
    console.log('emitting addSong')
    socket.broadcast.to(data.room).emit('addedSong', data.song);
  })
  //Communicate that a song has been removed
  socket.on('removeSong', function(data){
    socket.broadcast.to(data.room).emit('removedSong', data.index)
  })
  //Potential feature for mobile to initiate play
  socket.on('play', function(data){
    socket.broadcast.to(data.room).emit('playSong', data.song)
  })
  socket.on('sortingPlaylist', function(data){
    socket.broadcast.to(data.room).emit('sortedPlaylist', data.index)
  })
  //Notify mobile devices what song is playing
  socket.on('playingSong', function(data){
    socket.broadcast.to(data.room).emit('displaySong', data.song)
  })
});

function generateRoomKey(){
  var randomAdjs = ['old', 'red', 'blue', 'green', 'odd', 'nice', 'quick', 'short']
  var randomWords = ['tire','code','rock','road','cat','dog','bird','car','fox']
  var randomOne = randomAdjs[Math.floor(Math.random()*randomAdjs.length)];
  var randomTwo = randomWords[Math.floor(Math.random()*randomWords.length)];
  return randomOne + '-' + randomTwo;
}


var clientPath = path.join(__dirname, '../client');
var buildPath = path.join(__dirname, '../client/build');    // for gulped files
var indexHtmlPath = path.join(__dirname, './index.html');
var nodePath = path.join(__dirname, '../node_modules');
var imagePath = path.join(__dirname, './images');


app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(clientPath,{maxAge:31536000000}));
app.use(express.static(buildPath,{maxAge:31536000000}));
app.use(express.static(nodePath,{maxAge:31536000000}));
app.use(express.static(imagePath,{maxAge:31536000000}));

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

app.use(passport.initialize());

passport.use(new SpotifyStrategy({
  clientID: 'f0486532e4dc499b943637e59f489b19',
  clientSecret: 'adb0ec40299f439bade60f32d565c55f',
  callbackURL: 'http://localhost:4545/auth/spotify/callback'
},
function(accessToken, refreshToken, profile, done){
  console.log('accessToken',accessToken)
  return done();
}))

// Errors
//// Not found
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.get('/auth/spotify', 
  passport.authenticate('spotify'),
  function(req,res){

  })

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', {failureRedirect:'/login'}),
  function(req,res){
    res.redirect('/');
  })

//// Server issues
app.use(function(err, req, res, next) {
  res.sendStatus(err.status || 500);

});


module.exports = {
  app: app,
  server: server
}

