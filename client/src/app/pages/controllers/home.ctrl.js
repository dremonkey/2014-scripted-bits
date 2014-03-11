'use strict';

angular.module('particle.pages.controllers')
  .controller('HomeCtrl', function (_, $scope, $projects) {
    var contactLinks, getProjects;

    contactLinks = [
      {
        href: '//github.com/dremonkey',
        title: 'Github Profile - Andre Deutmeyer',
        icon: 'fa fa-github'
      },
      {
        href: '//twitter.com/drebabels',
        title: 'Twitter Profile - Andre Deutmeyer',
        icon: 'fa fa-twitter'
      },
      {
        href: '//linkedin.com/andredeutmeyer',
        title: 'Linkedin Profile - Andre Deutmeyer',
        icon: 'fa fa-linkedin'
      }
    ];

    // Get Projects
    getProjects = function (num) {
      var params;

      params = {
        number: num || 9
      };

      $projects.list(params).then(function (projects) {
        console.log(projects);
        $scope.projects = projects;
      });
    };

    // $scope assignment
    $scope.contactLinks = contactLinks;
    $scope.projects = null;

    // Initialize
    getProjects();
  });