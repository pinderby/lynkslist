'use strict';

/* Services */

var lynkslistServices = angular.module('lynkslistServices', []);

lynkslistServices.factory('PostsService', ['$http', function($http){
  var p = {
    posts: [],
    saved_posts: [],
    saving: false,
    voting: false
  };

  p.containsPost = function(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].id == obj.id) {
            return true;
        }
    }
    return false;
  }

  p.isSaved = function(post) {
    for (var i = 0; i < p.saved_posts.length; i++) {
        if (p.saved_posts[i].id == post.id) {
            return true;
        }
    }
    return false;
  }


  p.getAll = function() {
    return $http.get('/posts.json').success(function(data){
      angular.copy(data, p.posts);
    });
  };

  p.getSavedPosts = function(userId) {
    return $http.get('/users/' + userId + '/saved_posts.json').success( function(response) {
      angular.copy(response, p.posts);
      angular.copy(response, p.saved_posts);
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
    if (p.saving) return;
    p.saving = true;
    return $http.put('/posts/' + post.id + '/save_post')
      .success(function(data) {
        p.saved_posts = data;
        var tag = $($event.target).parent('.post_stat');
        tag.addClass("active");
        var saveCount = tag.children('.save_count').text();
        tag.children('.save_count').text(Number(saveCount)+1);
        console.log(data);
        p.saving = false;
      });
  };

  p.unsavePost = function($event, post, user) {
    if (p.saving) return;
    p.saving = true;
    return $http.put('/posts/' + post.id + '/unsave_post')
      .success(function(data) {
        p.saved_posts = data;
        var tag = $($event.target).parent('.post_stat');
        tag.removeClass("active");
        var saveCount = tag.children('.save_count').text();
        tag.children('.save_count').text(Number(saveCount)-1);
        console.log(data);
        p.saving = false;
      });
  };

  p.refreshPosts = function() {
    return $http.get('/refresh').success(function(data){
      angular.copy(data, p.posts);
    });
  };

  return p;
}])