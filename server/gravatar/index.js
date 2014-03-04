'use strict';

var _buildUrl, crypto, gravatar, qs;

// Module Dependencies
crypto = require('crypto');
qs = require('querystring');

_buildUrl = function (baseURL, email) {
  return baseURL + crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
};

gravatar = {
  avatar: function (email, options, https) {
    var base, queryData, query;
    base = (https && 'https://secure.gravatar.com/avatar/') || 'http://www.gravatar.com/avatar/';
    queryData = qs.stringify(options);
    query = (queryData && '?' + queryData) || '';
    return _buildUrl(base, email) + query;
  },

  profile: function (email, https) {
    var base;
    base = (https && 'https://secure.gravatar.com/') || 'http://www.gravatar.com/';
    return _buildUrl(base, email) + '.json';
  }
};

module.exports = gravatar;