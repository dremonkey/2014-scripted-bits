'use strict';

angular.module('particle.pages', [
  'ui.bootstrap',
  'ui.router.compat',
  'ui.gravatar',
  'ngAnimate',
  'particle.pages.controllers',
  'particle.pages.directives',
  'particle.pages.filters',
  'particle.pages.services',
  'restangular'
]);

angular.module('particle.pages')
  .config(function ($stateProvider, $httpProvider, $urlRouterProvider, RestangularProvider) {

    $urlRouterProvider
      .rule(function ($injector, $location) {
        var path, params, search;

        path = $location.path();
        search = $location.search(); // Note: misnomer. This returns a query object, not a search string

        // check to see if the path already ends in '/'
        if (path[path.length - 1] === '/') {
          return;
        }

        // If there was no search string / query params, return with a `/`
        if (Object.keys(search).length === 0) {
          return path + '/';
        }

        // Otherwise build the search string and return a `/?` prefix
        params = [];
        angular.forEach(search, function(v, k){
          params.push(k + '=' + v);
        });

        return path + '/?' + params.join('&');
      });
    
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'pages/templates/home.tpl.html',
        controller: 'HomeCtrl',
        data: {
          bodyId: 'page-home'
        }
      })

      .state('home.portfolio', {
        url: '^/#portfolio'
      })

      // Blog
      .state('posts', {
        url: '/posts',

        // in order for child states to access $stateParams parent view should be abstract
        abstract: true,

        // must have a ui-view in which to inject the child views
        // this can also be set to a template file with <ui-view/> in it
        template: '<ui-view/>',
        
        // will be shared with all child views
        data: {
          bodyId: 'page-posts'
        }
      })

      .state('posts.all', {
        abstract: true,
        templateUrl: 'pages/templates/posts.tpl.html',
        controller: 'PostsCtrl',
      })

      .state('posts.all.list', {
        url: '/',
        templateUrl: 'pages/templates/posts.list.tpl.html',
        controller: 'PostListCtrl',
        // resolve: {
        //   pagePosts: function ($stateParams, $posts) {
        //     return $posts.list($stateParams);
        //   }
        // }
      })

      .state('posts.all.page', {
        url: '/page/{page:[0-9]+}/',
        templateUrl: 'pages/templates/posts.list.tpl.html',
        controller: 'PostListCtrl',
        // resolve: {
        //   pagePosts: function ($stateParams, $posts) {
        //     return $posts.list($stateParams);
        //   }
        // }
      })

      .state('posts.filtered', {
        abstract: true,
        url: '/{filterBy:topic|tag}/{slug:[A-Za-z0-9-]+}/',
        templateUrl: 'pages/templates/posts.tpl.html',
        controller: 'PostsCtrl',
      })

      .state('posts.filtered.list', {
        url: '',
        templateUrl: 'pages/templates/posts.list.tpl.html',
        controller: 'PostListCtrl'
      })

      .state('posts.filtered.page', {
        url: '/page/{page:[0-9]+}/',
        templateUrl: 'pages/templates/posts.list.tpl.html',
        controller: 'PostListCtrl'
      })

      // Post Pages
      .state('post', {
        url: '/posts/{slug:[A-Za-z0-9-]+}/',
        templateUrl: 'pages/templates/post.tpl.html',
        controller: 'PostCtrl',
        data: {
          bodyId: 'page-post'
        }
      })

      .state('project', {
        url: '/projects/{slug:[A-Za-z0-9-]+}/',
        templateUrl: 'pages/templates/project.tpl.html',
        controller: 'ProjectCtrl',
        data: {
          bodyId: 'page-project'
        }
      });

      

    // Restangular Configurations
    RestangularProvider.setBaseUrl('/api/');

    RestangularProvider.setResponseExtractor(function (res, op, what) {
      var _new;

      if ('getList' === op && 'posts' === what) {
        _new = res.posts;
        _new.found = res.found;
      }
      else {
        _new = res;
      }

      return _new;
    });
  });

angular.module('particle.pages.controllers', [
  'ngSanitize',
  'particle.common.utils'
]);

angular.module('particle.pages.directives', [
  'ui.bootstrap.pagination'
]);

angular.module('particle.pages.filters', [
  'ngSanitize'
]);

angular.module('particle.pages.services', []);