'use strict';

angular.module('particle.pages.filters')

  .filter('readmore', function ($state, _) {
    return function (excerpt, slug, replacement) {
    
      // nothing to do if excerpt is empty  
      if (_.isEmpty(excerpt)) return excerpt;

      // default "Continue reading" replacement text
      replacement = replacement || 'more';
      
      // replace the href
      if (slug) {
        var _sref = $state.href('post', {slug: slug});
        excerpt = excerpt.replace(/href="[\w-\/\.:]+"/i, 'href="' + _sref + '"');
      }

      // replace the anchor text
      excerpt = excerpt.replace(/[Cc]ontinue reading+.+/i, replacement);

      return excerpt;
    };
  });