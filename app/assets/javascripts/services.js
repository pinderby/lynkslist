'use strict';

/* Services */

var lynkslistServices = angular.module('lynkslistServices', []);

lynkslistServices.factory('posts', ['$http', function($http){
  var p = {
    posts: []
  };
  p.getAll = function() {
    return $http.get('/posts.json').success(function(data){
      angular.copy(data, p.posts);
    });
  };

  p.upvote = function(post) {
  return $http.put('/posts/' + post.id + '/upvote.json')
    .success(function(data){
      post.upvotes += 1;
    });
  };

  p.increment_views = function(post) {
  return $http.put('/posts/' + post.id + '/increment_views.json')
    .success(function(data){
      post.views += 1;
    });
  };

  p.refreshPosts = function() {
    return $http.get('/refresh').success(function(data){
      angular.copy(data, p.posts);
    });
  };

  return p;
}])