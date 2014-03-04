'use strict';

var gravatar;

gravatar = require('../../gravatar');

module.exports = function (server) {
  server.get('/api/profile', function (req, res) {
    res.json({
      gravatar: gravatar.profile('a.deutmeyer@gmail.com')
    });
  });
};