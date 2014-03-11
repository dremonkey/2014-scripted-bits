'use strict';

angular.module('particle.pages.directives')
  
  .directive('scrollStop', function ($window, $state) {
    var def;

    def = {
      link: function (scope, element) {
        var $el;
        $el = element[0];

        scope.$on('$stateChangeSuccess', function () {
          if ($state.current.data.scrollTo === $el.id) {
            setTimeout(function () {
              console.log('scroll');
              $window.scrollTo(0, $el.offsetTop);
            }, 500);
          }
        });
      }
    };

    return def;
  })

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