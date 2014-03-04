'use strict';

angular.module('particle.pages.controllers')

  .controller('PostCtrl', function ($scope, $stateParams, $posts) {

    $posts.single($stateParams.slug).then(function (post) {

      $scope.currentPost = post;

      $posts.next(post.date).then(function (post) {
        $scope.nextPost = post;
      });
    });

    // Assign scope variables
    $scope.currentPost = {};
    $scope.nextPost = {};
  });