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

  p.getSavedPosts = function(userId) {
    return $http.get('/users/' + userId + '/saved_posts.json').success( function(response) {
      angular.copy(response, p.posts);
    });
  };

  p.upvote = function(post) {
  return $http.put('/posts/' + post.id + '/upvote.json')
    .success(function(data){
      post.upvotes += 1;
    });
  };

  p.incrementViews = function(post) {
  return $http.put('/posts/' + post.id + '/increment_views.json')
    .success(function(data){
      post.views += 1;
    });
  };

  p.savePost = function($event, post, user) {
  return $http.put('/posts/' + post.id + '/save_post')
    .success(function(data){
      $($event.target).addClass("active");;
    });
  };

  p.refreshPosts = function() {
    return $http.get('/refresh').success(function(data){
      angular.copy(data, p.posts);
    });
  };

  return p;
}])