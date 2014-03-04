'use strict';

angular.module('particle.pages.controllers')

  .controller('ProjectCtrl', function ($scope, $stateParams, $projects, $filter) {

    $projects.single($stateParams.slug).then(function (project) {

      project.content = $filter('removeImages')(project.content);
      
      $scope.currentProject = project;

      $projects.next(project.date).then(function (project) {
        $scope.nextProject = project;
      });
    });

    // Assign scope variables
    $scope.currentProject = {};
    $scope.nextProject = {};
  });