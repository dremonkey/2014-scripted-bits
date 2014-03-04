'use strict';

angular.module('particle.pages.directives')

  .directive('postList', function (utils) {
    var def;
    
    def = {
      priority: 10,
      templateUrl: 'pages/templates/posts.list.tpl.html',
      controller: 'PostListCtrl',
      link: {
        pre: function (scope, element, attrs) {
          var defaults, params;

          defaults = {
            displayLimit: 10,
            showCategory: true
          };

          // extract directive attributes and build request params
          params = utils.params(attrs.postList, defaults);

          // Scope Assignment
          scope.displayLimit = params.displayLimit; // how many posts per page to show
          scope.showCategory = params.showCategory;
        }
      }
    };

    return def;
  })

  .directive('uiViewWrapper', function ($rootScope) {
    var def;

    def = {
      link: function (scope, element) {
        $rootScope.$on('$postsLoaded', function () {
          // ghetto but we need to allow some time for the dom to render
          setTimeout(function () {
            var h = element[0].offsetHeight + 'px';
            element.css('height', h);
          }, 100);
        });
      }
    };

    return def;
  })

  // Hacky replacement for animating ui-view using ng-class
  // Needed because as of 0.2.8 ui-router has a problem with applying ng-class to ui-view
  // @see https://github.com/angular-ui/ui-router/issues/866
  //
  // When fixed, this can be removed and replaced with ng-class="animateClass" where $scope.animateClass
  // is the dynamic class to add to specify which animation to execute
  //
  // Depends on two outside variables
  //  @param animateClass - animation classname, should be set in the scope controller (or a parent)
  //  @param speed - should be the same as the animateClass css, defaults to 1s
  //
  // To use just add the animate-ui-view class to the ui-view you are trying to animate and make sure you
  // have your ng-enter,ng-enter-active, etc classes defined in your css 
  .animation('.animate-ui-view', function ($timeout) {
    var animate;
    
    animate = function (element, done) {
      var $element, speed, className;

      $element = angular.element(element);
      className = $element.scope().animateClass;
      speed = parseInt($element.attr('anim-speed')) || 1000;

      $element.addClass(className);

      $timeout(done, speed);
    };

    return {
      enter: function(element, done) {
        animate(element, done);
        
        // called when the animation completes or when the animation is cancelled
        return function () {
          var $element, className;
          $element = angular.element(element);
          className = $element.scope().animateClass;
          $element.removeClass(className); // remove classname when animation is complete
        };
      },

      leave: function(element, done) {
        animate(element, done);
      }
    };
  });