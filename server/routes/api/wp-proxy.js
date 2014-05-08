'use strict';

// Module Dependencies
var _ = require('lodash');
var querystring = require('querystring');
var request = require('request');
var util = require('util');

/**
 * Utility function to map a request to the Wordpress REST API endpoint
 */
var mapUrl = function (params, query) {

  var endpoint = '';

  // Build the base url
  var version = 'v1';
  var siteID = 62801866;
  var base = util.format('https://public-api.wordpress.com/rest/%s/sites/%d/', version, siteID);

  // Build the endpoint
  if ('site' === params.resource) {
    endpoint = base;
  }
  else {
    var qs = _.isEmpty(query) ? '' : '?' + querystring.stringify(query);

    // Determine if param.id is a post id or a post slug
    if (params.id) {
      params.id = params.id.match(/[0-9]+/) && params.id || 'slug:' + params.id;
    }
    
    // build wordpress endoint
    var wpPath = _.reduce([params.resource, params.id, params.action], function (memo, val) {
      if (val) memo += '/' + val;
      return memo;
    });
  
    endpoint = base + wpPath + qs;
  }

  return endpoint;
};

/**
 * Utility function to see if a resource endpoint is good
 */
var isWhitelisted = function (resource) {
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