'use strict';

angular.module('particle.pages.controllers')

  .controller('PostCtrl', function ($scope, $state, $stateParams, $posts) {

    /*
     * Replaces internal post content links with the links for this site
     */
    function _replaceContentLinks (content) {
      var re = /http:\/\/scriptedbits.wordpress.com\/\d{4}\/\d{2}\/\d{2}/;
      return content.replace(re, $state.get('posts').url);
    }

    $posts.single($stateParams.slug).then(function (post) {

      // Replace links
      post.content = _replaceContentLinks(post.content);

      $scope.currentPost = post;

      $posts.next(post.date).then(function (post) {
        $scope.nextPost = post;
      });
    });

    // Assign scope variables
    $scope.currentPost = {};
    $scope.nextPost = {};
  });