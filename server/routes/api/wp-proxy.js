'use strict';

var _, isWhitelisted, log, mapUrl, path, querystring, request, util;

// Module Dependencies
_ = require('lodash');
log = require('../../utils/logger');
path = require('path');
querystring = require('querystring');
request = require('request');
util = require('util');

/**
 * Utility function to map a request to the Wordpress REST API endpoint
 */
mapUrl = function (params, query) {
  var _base, _path, _qs, _version, _siteID, endpoint;

  // Build the base url
  _version = 'v1';
  _siteID = 62801866;
  _base = util.format('https://public-api.wordpress.com/rest/%s/sites/%d/', _version, _siteID);

  // Build the endpoint
  if ('site' === params.resource) {
    endpoint = _base;
  }
  else {
    _qs = _.isEmpty(query) ? '' : '?' + querystring.stringify(query);

    // Determine if param.id is a post id or a post slug
    if (params.id) {
      params.id = params.id.match(/[0-9]+/) && params.id || 'slug:' + params.id;
    }
    
    _path = path.normalize([params.resource, params.id, params.action].join('/'));
    endpoint = _base + _path + _qs;
  }

  return endpoint;
};

/**
 * Utility function to see if a resource endpoint is good
 */
isWhitelisted = function (resource) {
  return ['site', 'posts', 'categories', 'tags'].indexOf(resource) !== -1;
};

module.exports = function (server) {

  server.get('/api/:resource', function (req, res, next) {
    if (isWhitelisted(req.params.resource)) {
      request.get(mapUrl(req.params, req.query)).pipe(res);
      return;
    }

    next();
  });

  server.get('/api/:resource/:id', function (req, res, next) {
    if (isWhitelisted(req.params.resource)) {
      request.get(mapUrl(req.params, req.query)).pipe(res);
      return;
    }

    next();
  });

  // server.post('/api/:resource/:id/:action', function (req, res) {
  //   if ('posts' == req.params.resource) {
  //     request.post(mapUrl(req.params, req.query)).pipe(res);
  //     return;
  //   }

  //   next();
  // });
};