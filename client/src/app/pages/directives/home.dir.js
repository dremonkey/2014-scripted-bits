'use strict';

angular.module('particle.pages.directives')
  .directive('home', function () {
    var def;
    
    def = {
      priority: 10,
      link: function () {}
    };

    return def;
  })

  .directive('project', function () {
    var def;

    def = {
      link: function () {}
    };

    return def;
  });