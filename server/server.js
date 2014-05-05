'use strict';

// Module dependencies
var express = require('express');
var http = require('http');
var middleware = require('./middleware');
var routes = require('./routes');

var config = require('./config/index.js');
var log = require('./utils/logger');

var startServer = function (server, configObj) {
  server.set('port', configObj.server.port);
  return http.createServer(server).listen(server.get('port'), function () {
    log.info('Express server listening on port ' + server.get('port'));
  });
};

// Sets up the express server instance
// Instantiates the routes, middleware, and starts the http server
var init = function (server) {

  // Retrieve the configuration object
  var configObj = config.get();

  // log requests to the console
  // server.use(express.logger('dev'));
  server.use(express.logger());

  // extract data from the body of the request
  server.use(express.bodyParser());

  server.use(express.methodOverride());

  // ## Middleware
  middleware(server, configObj);

  // ## Initialize Routes
  routes.api(server);

  // Forward remaining requests to index
  server.all('/*', function (req, res) {
    res.sendfile('index.html', {root: server.get('views')});
  });

  // ## Error Handler
  // Picks up any left over errors and returns a nicely formatted server 500 error
  server.use(express.errorHandler());

  // Start the server
  startServer(server, configObj);
};

// Initializes the server
config.load().then(function () {
  log.info('Configurations loaded... initializing the server');
  init(express());
});