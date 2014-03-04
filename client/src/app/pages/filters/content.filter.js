'use strict';

angular.module('particle.pages.filters')
  
  .filter('removeImages', function () {
    return function (content) {
      content = content.replace(/(<p>)?(<a.+>)?<img.+\/>(<\/a>)?(<\/p>)?/gi, '');
      return content;
    };
  });