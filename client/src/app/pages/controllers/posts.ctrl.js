'use strict';

angular.module('particle.pages.controllers')

  .controller('PostsCtrl', function ($rootScope, $scope, $state, $stateParams, $bloginfo, $tags, $topics) {
    var filterBy, slug;

    console.log('>>>> PostsCtrl');

    slug = $state.params.slug || '';
    filterBy = $state.params.filterBy || '';

    // Retrieve the topic information for the title and description
    if ('topic' === filterBy) {
      $topics.single(slug).then(function (data) {
        $scope.pageTitle = data.name;
        $scope.pageDescription = data.description;
      });
    }
    // Retrieve the tag information for the title and description
    else if ('tag' === filterBy) {
      $tags.single(slug).then(function (data) {
        $scope.pageTitle = data.name;
        $scope.pageDescription = data.description;
      });
    }
    else {
      $bloginfo.get().then(function (data) {
        $scope.pageTitle = 'All Posts';
        $scope.pageDescription = data.description;
      });
    }

    $scope.$on('$pageChangeStart', function (event, newpage, oldpage) {
      console.log('newpage', newpage, 'oldpage', oldpage);
      $scope.animateClass = newpage > oldpage ? 'slide-left' : 'slide-right';
    });
    
    // Scope Assignment
    // Remember that this will be shared with child scopes
    $scope.pageTitle = '';
    $scope.pageDescription = '';
    $scope.displayLimit = 10; // changes the number of displayed posts-per-page
    $scope.showCategory = true;
  })

  .controller('PostListCtrl', function ($rootScope, $scope, $stateParams, $posts) {

    this.getPosts = function (page) {
      var params;

      console.log('>>>> PostListCtrl.getPosts');

      params = $stateParams;
      params.page = page || $scope.currentPage;
      params.number = $scope.displayLimit;

      $posts.list(params).then(function (posts) {
        $scope.pagedPosts = posts;
      });
    };

    // Scope Assignment
    $scope.pagedPosts = null;
    $scope.currentPage = parseInt($stateParams.page) || 1; // current page

    // Initialize
    this.getPosts();
  })

  .controller('PostListPaginationCtrl', function ($state, $stateParams, $rootScope, $scope) {
    var goToPage;

    console.log('>>>> PostListPaginationCtrl');
    console.log('$stateParams', $stateParams);
    
    // Callback function to execute when a new page is clicked
    goToPage = function (page) {
      var newpage, oldpage, params, stateName;

      oldpage = $scope.currentPage;
      newpage = page || 1;

      // Emit the page change start event
      $scope.$emit('$pageChangeStart', newpage, oldpage);

      // Build the new state parameters
      params = {
        filterBy: $stateParams.filterBy || '',
        slug: $stateParams.slug || '',
        page: newpage
      };

      // Build the stateName
      if (!$stateParams.page) {
        stateName = $state.$current.parent.name + '.page';
      }
      else {
        stateName = $state.current.name;
      }
      
      console.log('goto state', stateName, params);

      // Update scope with new page
      $scope.currentPage = page;

      // Go to the new state
      $state.go(stateName, params);
    };

    // Event Listeners
    $rootScope.$on('$postsLoaded', function (event, posts) {

      // Update scope variables for pagination
      $scope.pagedPosts = posts;
      $scope.totalItems = posts.found;
    });

    // Scope Assignment
    $scope.goToPage = goToPage;
    $scope.currentPage = $stateParams.page || 1;

     // totalItems needs to be very large number initially in order to prevent pagination from
    // prematurely firing the goToPage() function. Because posts is loaded asynchronously, scope.totalItems
    // is not known until after the directive is rendered.
    //
    // For example if `scope.totalItems = 1` and `scope.currentPage = 2` on initial load, then pagination will 
    // determine that `scope.currentPage` doesn't exist because there are not enough items for two pages so it 
    // will trigger the goToPage() function via the pagination on-select-page attribute and cause page 1 to load
    $scope.totalItems = 1000;
  });