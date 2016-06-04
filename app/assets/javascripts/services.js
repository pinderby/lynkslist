'use strict';

/* Services */

var lynkslistServices = angular.module('lynkslistServices', []);

lynkslistServices.factory('PostsService', ['$http', 'Auth', function($http, Auth){
  var p = {
    user: {},
    posts: [],
    saved_posts: [],
    voted_posts: [],
    saving: false,
    voting: false,
    listName: '',
    sort: 'recent',
    timescope: 7
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

  // p.getAll = function(page) {
  //   return $http.get('/posts/page/'+page).success(function(data){
  //     p.addRelativeTimes(data);
  //     angular.copy(data, p.posts);
  //   });
  // };

  p.getAll = function(page) {
    console.log('/posts/page/'+page+'?sort='+p.sort+'&timescope='+p.timescope);
    return $http.get(
      '/posts/page/'+page+
      '?sort='+p.sort+
      '&timescope='+p.timescope).success(function(data){
      
      p.addRelativeTimes(data);
      angular.copy(data, p.posts);
      p.checkForUser();
    });
  };

  p.sortPosts = function(page) {
    console.log(p.listName);
    console.log("p.listName == ''");
    console.log(p.listName == '');
    console.log(p.sort);
    console.log(p.timescope);
    console.log(page);
    if(p.listName != '') {
      p.getListPosts(page);
    } else {
      p.getAll(page);
    }
  };

  p.getListPosts = function(page) {
    console.log('/lists/'+p.listName+'/posts/page/'+page+'?sort='+p.sort+'&timescope='+p.timescope);
    return $http.get(
      '/lists/'+p.listName+
      '/posts/page/'+page+
      '?sort='+p.sort+
      '&timescope='+p.timescope).success(function(data){
      
      p.addRelativeTimes(data);
      angular.copy(data, p.posts);
    });
  };

  p.getSavedPosts = function(userId) {
    return $http.get('/users/' + userId + '/saved_posts.json').success( function(response) {
      angular.copy(response, p.posts);
      angular.copy(response, p.saved_posts);
    });
  };

  p.refreshPosts = function(page) {
    // TODO --DM-- Add loading overlay while it's loading
    return $http.get('/refresh').then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      p.sortPosts(page);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  };

  // Upvote post
  p.upvote = function(votes, post) {
    // Check whether to use local vote value or calculate
    if (post.hasOwnProperty("currentVote")) {
      var voteValue = post.currentVote;
    } else { 
      var voteValue = p.getVoteValue(votes, post);
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
        $('.downvote_'+post.id).removeClass("active");

        // Update vote count
        post.points += voteAdjustment;

        console.log(data);

        // Reenable button
        p.voting = false;

        // Set current vote
        post.currentVote = 1;
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
        $('.downvote_'+post.id).removeClass("active");

        // Update vote count
        post.points -= 1;

        console.log(data);

        // Reenable button
        p.voting = false;

        // Set current vote
        post.currentVote = 0;
    });
  };

  // Downvote post
  p.downvote = function(votes, post) {
    // Check whether to use local vote value or calculate
    if (post.hasOwnProperty("currentVote")) {
      var voteValue = post.currentVote;
    } else { 
      var voteValue = p.getVoteValue(votes, post);
    }

    // Determine pathway based on vote value
    if (voteValue == 1) {
      p.sendDownvote(post, -2);
    } else if (voteValue == 0) {
      p.sendDownvote(post, -1);
    } else if (voteValue == -1) {
      p.deleteDownvote(post);
    } else {
      // Error
      console.log("voteValue error: " + voteValue);
    }
  };

  p.sendDownvote = function(post, voteAdjustment) {
    // Return if another call is being made
    if (p.voting) return;
    
    // Set voting to true to disable button while call is made
    p.voting = true;

    // Send PUT request to downvote post
    return $http.put('/posts/' + post.id + '/downvote.json')
      .success(function(data){
        // Update voted_posts
        p.voted_posts = data;

        // Make voted icon active
        $('.downvote_'+post.id).addClass("active");
        $('.upvote_'+post.id).removeClass("active");

        // Update vote count
        post.points += voteAdjustment;

        console.log(data);

        // Reenable button
        p.voting = false;

        // Set current vote
        post.currentVote = -1;
    });
  };

  p.deleteDownvote = function(post) {
    // Return if another call is being made
    if (p.voting) return;
    
    // Set voting to true to disable button while call is made
    p.voting = true;

    // Send DELETE request to delete downvote from post
    return $http.delete('/posts/' + post.id + '/downvote.json')
      .success(function(data){
        // Update voted_posts
        p.voted_posts = data;

        // Make voted icon inactive
        $('.downvote_'+post.id).removeClass("active");
        $('.upvote_'+post.id).removeClass("active");

        // Update vote count
        post.points += 1;

        console.log(data);

        // Reenable button
        p.voting = false;

        // Set current vote
        post.currentVote = 0;
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
        $('.save_count_'+post.id).each(function(index) {
          var saveCount = $(this).text();
          $(this).text(Number(saveCount)+1);
        });

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
        $('.save_count_'+post.id).each(function(index) {
          var saveCount = $(this).text();
          $(this).text(Number(saveCount)-1);
        });
        
        // Reenable button
        p.saving = false;
      });
  };

  p.addRelativeTimes = function(posts) {
    for (var i = 0; i < posts.length; i++) {
      // Calculate relative publish time for all posts
      posts[i].published_relative = 
          moment(posts[i].published_at).fromNow();
    }
  };

  p.checkForUser = function() {
    console.log("checkForUser");
    console.log("jQuery.isEmptyObject(p.user): "+jQuery.isEmptyObject(p.user));
    if (jQuery.isEmptyObject(p.user)) {
      // If p.user is undefined, get user from server
      Auth.currentUser().then(function (user){
        $http.get('/users/' + user.id + '.json').success( function(response) {
            p.user = response;
            p.highlightPosts();
        });
      });
    } else {
      // TODO --DM-- Execute after render
      setTimeout(function () { p.highlightPosts(); }, 100);
    }
  };

  p.highlightPosts = function() {
    // Highlight all saved posts
    console.log(p.user);
    p.saved_posts = p.user.saved_posts;
    for (var i = 0; i < p.user.saved_posts.length; i++) {                    
        $('.save_stat_'+p.user.saved_posts[i].id).addClass('active');
    }

    // Highlight all votes
    p.voted_posts = p.user.voted_posts;
    console.log(p.voted_posts);
    for (var i = 0; i < p.user.votes.length; i++) { 
        if (p.user.votes[i].value == 1) {
            console.log("$('.upvote_'"+p.user.votes[i].post_id+")");
            $('.upvote_'+p.user.votes[i].post_id).addClass("active");
        } else if (p.user.votes[i].value == -1) {
            $('.downvote_'+p.user.votes[i].post_id).addClass("active");
        } else {
            console.log('Vote error: ' + p.user.votes[i].value);
        }
    }
  };

  return p;
}]);

