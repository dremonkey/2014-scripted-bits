'use strict';

module.exports = function (server) {

  // Initialize API routes
  require('./profile')(server);
  require('./wp-proxy')(server);

};