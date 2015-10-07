// Transpile ES6 to ES5
require('babel/register');

var chalk = require('chalk');

var port = (process.env.PORT || 4545);
var app, server;


    app = require('./app').app;
    server = require('./app').server;
    server.listen(port, function() {
      console.log('The server is listening on port', chalk.green.bold(port), 'and loves you very much.');
    });
