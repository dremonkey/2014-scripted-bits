'use strict';

angular.module('particle.pages.services')
  
  .factory('$topics', function (Restangular, $q) {
    var topicSlugs;

    topicSlugs = [
      'cryptocurrency', 'projects', 'random', 'test'
    ];

    return {
      
      // Retrieve a list of topics/categories
      list: function () {
        var deferred;

        deferred = $q.defer();
        
        // Wordpress REST Api does not provide an easy way to retrieve all categories
        // so instead it has been hardcoded and mimics the promise -> resolve workflow of a
        // http request
        setTimeout(function () {
          deferred.resolve(topicSlugs);
        }, 100);
  
        return deferred.promise;
      },

      // Retrieve a single topic/category by slug
      single: function (slug) {
        var topic = Restangular.one('categories', slug);
        return topic.get();
      }
    };
  });