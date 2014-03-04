'use strict';

angular.module('particle.pages.services')

  .factory('$projects', function ($q, $posts, utils, _) {
    var self;

    self = this;

    this.list = function (params) {
      var defaults, merged;

      defaults = {
        number: 100,
        category: 'projects'
      };

      merged = utils.params(params, defaults);

      return $posts.list(merged);
    };

    this.single = function (slugOrID) {
      var deferred;

      deferred = $q.defer();

      $posts.single(slugOrID).then(function (project) {

        // convert attachments object to an array
        project.attachments = _.map(project.attachments, function (attachment) {
          return attachment;
        });

        deferred.resolve(project);
      });

      return deferred.promise;
    };

    this.next = function (dateTime) {
      var params;
      
      params = {
        category: 'projects'
      };

      return $posts.next(dateTime, params);
    };

    // projects.get = function (num) {
    //   var list, widths, heights;
      
    //   list = [];
    //   widths = [270];
    //   heights = [270,300,320,360,400];

    //   for (var i = 0; i < num; i++) {
    //     var w, h;
        
    //     w = widths[Math.floor(Math.random() * widths.length)];
    //     h = heights[Math.floor(Math.random() * heights.length)];

    //     list.push({
    //       width: w,
    //       height: h,
    //       src: 'http://lorempixel.com/g/' + w+ '/' + h + '/?' + Math.floor(Math.random() * 10000)
    //     });
    //   }

    //   return list;
    // };

    return this;
  });