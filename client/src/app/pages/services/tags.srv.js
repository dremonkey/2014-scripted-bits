'use strict';

angular.module('particle.pages.services')
  
  .factory('$tags', function (Restangular) {
    var Tags;

    Tags = Restangular.all('tags');

    return {
      
      // Retrieve a list of tags
      list: function (params) {
        params = params || {};
        return Tags.getList(params);
      },

      // Retrieve a single tag by slug
      single: function (slug) {
        var tag;
        tag = Restangular.one('tags', slug);
        return tag.get();
      }
    };
  });