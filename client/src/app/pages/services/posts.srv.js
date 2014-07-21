'use strict';

angular.module('particle.pages.services')

  // All request params should follow Wordpress REST Api `posts` resource query params
  // http://developer.wordpress.com/docs/api/1/get/sites/$site/posts/
  .factory('$posts', function (_, $state, $rootScope, Restangular, $q, utils) {
    var Posts, self, defaultExcluded;

    // do some data transformation on the returned posts
    Restangular.addElementTransformer('posts', true, function (_posts) {

      _posts = _.forEach(_posts, function (_post) {
        // convert tags object to an array
        _post.tags = _.map(_post.tags, function (tag) {
          return tag;
        });

        // _post.attachments = _.map(_post.attachments, function (attachment) {
        //   return attachment;
        // });
      });

      return _posts;
    });

    self = this;
    Posts = Restangular.all('posts');
    
    // default excluded categories
    // @TODO need to move this to a config file or make $posts a provider
    defaultExcluded = ['projects'];

    // ----------------------------
    // Internal Helpers
    // ----------------------------

    // Removes excluded posts
    // @NOTE This is done here because there is not way to exclude categories using the
    // Wordpress REST API query parameters
    function _excludeFromList (params, posts, excluded) {
      posts = _.filter(posts, function (post) {
        return !_.some(post.categories, function (cat) {
          return excluded.indexOf(cat.slug) !== -1;
        });
      });

      return posts;
    }

    // @param params (obj) get posts query parameters
    // @param excluded (arr) Array of categories to exclude
    function _getSinglePost (params, excluded) {
      var deferred;
      
      deferred = $q.defer();
      excluded = excluded || [];

      // callback function for _.some()
      function _cb (cat) {
        return excluded.indexOf(cat.slug) !== -1;
      }

      Posts.getList(params).then(function (posts) {
        var resolved = null;

        // if a next posts exists, resolve and return it
        if(posts.found) {
          // return the first post that is not categorized as 'projects'
          for (var i = 0; i < posts.length; i++) {
            if (_.some(posts[i].categories, _cb)) continue;
            deferred.resolve(posts[i]);
            resolved = true;
            break;
          }
        }

        // otherwise grab the first post, resolve, and return it
        if (!resolved) {
          self.first(params).then(function (post) {
            deferred.resolve(post);
          });
        }
      });

      return deferred.promise;
    }

    // ----------------------------
    // Public Methods
    // ----------------------------

    this.list = function (params) {
      var deferred, defaults, merged;

      deferred = $q.defer();

      defaults = {
        number: 20,
        page: 1,
        order: 'DESC',
        // order_by: 'date',
        status: 'publish',
        after: undefined,
        before: undefined,
        tag: undefined,
        category: undefined,
        search: undefined,
        // meta_key: undefined,
        // meta_value: undefined
      };

      // Do some formatting
      if (params.displayLimit) params.number = params.displayLimit;
      if (params.filterBy && params.slug) {
        if ('topic' === params.filterBy) params.category = params.slug;
        else params[params.filterBy] = params.slug;
      }

      merged = utils.params(params, defaults);

      console.info('>>>> Requesting posts for', merged.category || 'all');

      // Get the posts
      Posts.getList(merged).then(function (posts) {
        if (!params.category) {
          posts = _excludeFromList(params, posts, defaultExcluded);
        }

        deferred.resolve(posts);
        $rootScope.$broadcast('$postsLoaded', posts);
      });

      return deferred.promise;
    };

    this.single = function (slugOrID, params) {
      var post, defaults, deferred, merged;
      
      deferred = $q.defer();

      defaults = {
        context: 'display'
      };

      merged = utils.params(params, defaults);
      
      post = Restangular.one('posts', slugOrID);
      post.get(merged).then(function (post) {
        deferred.resolve(post);
        $rootScope.$broadcast('$postLoaded', post);
      });

      return deferred.promise;
    };

    this.next = function (dateTime, params) {
      var defaults, merged, excluded;

      // default parameters
      defaults = {
        number: 5,
        order: 'ASC',
        after: moment(dateTime).add('s', 10).utc().format('YYYY-MM-DDTHH:mm:ssZ'),
        category: undefined
      };

      merged = utils.params(params, defaults);

      // if we are retrieving a specific category, make sure it is not in the excluded list
      excluded = _.without(defaultExcluded, merged.category);
      
      return _getSinglePost(merged, excluded);
    };

    this.prev = function (dateTime, params) {
      var defaults, merged, excluded;

      defaults = {
        number: 1,
        before: moment(dateTime).subtract('s', 10).utc().format('YYYY-MM-DDTHH:mm:ssZ'),
        category: undefined
      };

      merged = utils.params(params, defaults);

      // if we are retrieving a specific category, make sure it is not in the excluded list
      excluded = _.without(defaultExcluded, merged.category);

      return _getSinglePost(merged, excluded);
    };

    this.first = function (params, excluded) {
      var defaults, merged, deferred;

      deferred = $q.defer();

      defaults = {
        number: 1,
        order: 'ASC',
        category: undefined
      };

      merged = utils.params(params, defaults);

      // if we are retrieving a specific category, make sure it is not in the excluded list
      excluded = _.without(defaultExcluded, merged.category);

      Posts.getList(merged).then(function (posts) {
        posts = _excludeFromList(merged, posts, excluded);
        deferred.resolve(posts[0]);
      });
      
      return deferred.promise;
    };

    this.last = function (params, excluded) {
      var defaults, merged, deferred;

      deferred = $q.defer();

      defaults = {
        number: 1,
        category: undefined
      };

      merged = utils.params(params, defaults);

      // if we are retrieving a specific category, make sure it is not in the excluded list
      excluded = _.without(defaultExcluded, merged.category);

      Posts.getList(merged).then(function (posts) {
        posts = _excludeFromList(merged, posts, excluded);
        deferred.resolve(posts[0]);
      });

      return deferred.promise;
    };

    return this;
  });