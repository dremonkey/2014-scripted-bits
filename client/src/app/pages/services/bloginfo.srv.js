'use strict';

angular.module('particle.pages.services')
  
  .factory('$bloginfo', function (Restangular) {
    return {
      // Retrieve site information
      get: function () {
        return Restangular.one('site', '').get();
      }
    };
  });