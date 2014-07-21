'use strict';

/**
 * Attach to any element that needs the skrollr functionality
 */

angular.module('particle.common.skrollr')

  .directive('skrollr', function (skrollrd) {
    var def;

    def = {
      link: function (scope, element) {
  
        // console.log('>>>> init skrollr directive');

        // Initialize this element
        skrollrd.refresh(element[0]);

        // Watch for changes to the element offsetTop
        // because it means we will have recalculate the skrollr keyframes
        scope.$watch(function () {
          var top = element[0].offsetTop;
          return top;
        }, function (newTop, oldTop) {
          if (newTop === oldTop) return;
          // console.log('newTop', newTop);
          skrollrd.refresh(element[0]);
        });

        // Do Cleanup
        scope.$on('$destroy', function () {
          // console.log('$destroy', 'skrollr-directive');
          skrollrd.destroy();
        });
      }
    };

    return def;
  })

  .directive('skrollrMasonry', function (skrollrd, utils, $timeout) {
    var def;

    def = {
      link: function (scope, element) {
        var timer;

        // hide until ready
        element.addClass('invisible');
      
        // assign a unique id if it doesn't have one
        if (!element.attr('id')) {
          element.attr('id', utils.getUUID());
        }

        scope.mason.on('layoutComplete', function (instance, items) {
          
          // Cancel any existing timer
          if (timer) $timeout.cancel(timer);

          for (var i = items.length - 1; i >= 0; i--) {
            var _el, _start, _end, _top;

            _el = angular.element(items[i].element);
            _top = parseInt(_el.css('top'), 10);

            // generate skrollr type data attribute keys
            // start and end points will be relative to the masonry wrapper element
            _start = ['data',700 - _top,'top'].join('-');
            _end = ['data',550 - _top,'top'].join('-');

            // assign animations
            _el.attr(_start, 'transform: matrix(0,0,0,0,0,0); opacity:0;');
            _el.attr(_end, 'transform: matrix(1,0,0,1,0,0);opacity:1;');
          }

          // refresh skrollr... 
          // use timeout to make sure refresh is called after the last layoutComplete broadcast
          timer = $timeout(function () {
            // console.log('>>>> skrollr masonry directive refresh');
            element.removeClass('invisible');
            skrollrd.refresh(element[0]);
          }, 600);

        });

        // Do Cleanup
        scope.$on('$destroy', function () {
          // console.log('$destroy', 'skrollr-masonry');
          skrollrd.destroy();
        });
      }
    };

    return def;
  })

  .directive('skrollrMasonryBrick', function () {
    var def;

    def = {
      link: function (scope, element) {
        // assign anchor to parent
        element.attr('data-anchor-target', '#'+element.parent().attr('id'));
      }
    };

    return def;
  });