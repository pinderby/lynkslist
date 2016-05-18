'use strict';

/* Services */

var lynkslistServices = angular.module('lynkslistServices', []);

lynkslistServices.factory('PostsService', ['$http', function($http){
  var p = {
    posts: [],
    saved_posts: [],
    voted_posts: [],
    currentVote: 10,
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
    return p.containsPost(p.saved_posts, post);
  }

  p.isVoted = function(post) {
    return p.containsPost(p.voted_posts, post);
  }

  p.getVoteValue = function(votes, post) {
    if (votes == null) return 0;
    for (var i = 0; i < votes.length; i++) {
        if (votes[i].post_id == post.id) {
            return votes[i].value;
        }
    }
    return 0;
  }

  p.getAll = function() {
    return $http.get('/posts.json').success(function(data){
      angular.copy(data, p.posts);
    });
  };

  p.getListPosts = function(name) {
    return $http.get('/lists/' + name + "/posts").success( function(data) {
      angular.copy(data, p.posts);
    });
  };

  p.getSavedPosts = function(userId) {
    return $http.get('/users/' + userId + '/saved_posts.json').success( function(response) {
      angular.copy(response, p.posts);
      angular.copy(response, p.saved_posts);
    });
  };

  // Upvote post
  p.upvote = function(votes, post) {
    // Check whether to use local vote value or calculate
    if (p.currentVote == 10) {
      var voteValue = p.getVoteValue(votes, post);
    } else { 
      var voteValue = p.currentVote;
    }

    // Determine pathway based on vote value
    if (voteValue == 1) {
      p.deleteUpvote(post);
    } else if (voteValue == 0) {
      p.sendUpvote(post, 1);
    } else if (voteValue == -1) {
      p.sendUpvote(post, 2);
    } else {
      // Error
      console.log("voteValue error: " + voteValue);
    }
  };

  p.sendUpvote = function(post, voteAdjustment) {
    // Return if another call is being made
    if (p.voting) return;
    
    // Set voting to true to disable button while call is made
    p.voting = true;

    // Send PUT request to upvote post
    return $http.put('/posts/' + post.id + '/upvote.json')
      .success(function(data){
        // Update voted_posts
        p.voted_posts = data;

        // Make voted icon active
        $('.upvote_'+post.id).addClass("active");

        // Update vote count
        var voteCount = $('.vote_points_'+post.id).text();
        $('.vote_points_'+post.id).text(Number(voteCount)+voteAdjustment);

        console.log(data);

        // Reenable button
        p.voting = false;

        // Set current vote
        p.currentVote = 1;
    });
  };

  p.deleteUpvote = function(post) {
    // Return if another call is being made
    if (p.voting) return;
    
    // Set voting to true to disable button while call is made
    p.voting = true;

    // Send DELETE request to delete upvote from post
    return $http.delete('/posts/' + post.id + '/upvote.json')
      .success(function(data){
        // Update voted_posts
        p.voted_posts = data;

        // Make voted icon inactive
        $('.upvote_'+post.id).removeClass("active");

        // Update vote count
        var voteCount = $('.vote_points_'+post.id).text();
        $('.vote_points_'+post.id).text(Number(voteCount)-1);

        console.log(data);

        // Reenable button
        p.voting = false;

        // Set current vote
        p.currentVote = 0;
    });
  };

  p.incrementViews = function(post) {
  return $http.put('/posts/' + post.id + '/increment_views.json')
    .success(function(data){
      post.views += 1;
    });
  };

  // Save post
  p.savePost = function($event, post, user) {

    // Return if another call is being made
    if (p.saving) return;
    
    // Set saving to true to disable button while call is made
    p.saving = true;

    // Send PUT request to save post
    return $http.put('/posts/' + post.id + '/save_post')
      .success(function(data) {
        // Update saved_posts
        p.saved_posts = data;

        // Make saved icon active
        $('.save_stat_'+post.id).addClass("active");

        // Update save count
        var saveCount = $('.save_count_'+post.id).text();
        $('.save_count_'+post.id).text(Number(saveCount)+1);

        console.log(data);

        // Reenable button
        p.saving = false;
      });
  };

  // Unsave post
  p.unsavePost = function($event, post, user) {
    
    // Return if another call is being made
    if (p.saving) return;

    // Set saving to true to disable button while call is made
    p.saving = true;
    return $http.put('/posts/' + post.id + '/unsave_post')
      .success(function(data) {
        // Update saved_posts
        p.saved_posts = data;

        // Make saved icon inactive
        $('.save_stat_'+post.id).removeClass("active");

        // Update save count
        var saveCount = $('.save_count_'+post.id).text();
        $('.save_count_'+post.id).text(Number(saveCount)-1);
        
        console.log(data);
        
        // Reenable button
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