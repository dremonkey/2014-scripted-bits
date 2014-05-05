'use strict';

module.exports = function (server) {
  require('./api/wp-proxy')(server);
};