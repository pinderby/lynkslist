angular.module('lynkslistApp')
    .controller('ContentCtrl', ['$scope', '$http', '$state', '$stateParams', 'Auth', 'PostsService', 
            function($scope, $http, $state, $stateParams, Auth, PostsService) {


        if($('#route').data("model") == "list") {
            var name = $('#route').data("name");
            $scope.posts = PostsService.getListPosts(name);
        } else {
            $scope.posts = PostsService.posts;
        }

        for (var i = 0; i < $scope.posts.length; i++) {
            // Calculate relative publish time for all posts
            $scope.posts[i].published_relative = 
                moment($scope.posts[i].published_at).fromNow();

            // Calculate vote points for all posts
            if ($scope.posts[i].votes == null) return;
            $scope.posts[i].points = 0;
            for (var i2 = 0; i2 < $scope.posts[i].votes.length; i2++) {
                $scope.posts[i].points += $scope.posts[i].votes[i2].value;
            }
        }

        Auth.currentUser().then(function (user){
            $http.get('/users/' + user.id + '.json').success( function(response) {
                $scope.user = response;
                PostsService.saved_posts = $scope.user.saved_posts;
                for (var i = 0; i < $scope.posts.length; i++) {
                    is_saved = PostsService.isSaved($scope.posts[i]);
                    $scope.posts[i].saved_by_user = is_saved;
                }
            });
        });



        $scope.openLink = function(post) {
            $scope.articleUrl = post.canonical_url;
            $('#article-iframe').attr('src', post.canonical_url);
            PostsService.incrementViews(post);
            document.getElementById("myNav").style.left = "10%";
            document.getElementById("iframe-btn-container").style.left = "10%";
        }

        $scope.closeNav = function() {
            document.getElementById("myNav").style.left = "100%";
            document.getElementById("iframe-btn-container").style.left = "100%";
            $('#article-iframe').attr('src', 'about:blank');
        }

        $scope.refresh = function() {
            // TODO --DM-- Add loading overlay while it's loading
            $http.get('/refresh').success( function(response) {
                $scope.posts = response;
            });
        }

        $scope.showSavedPosts = function() {
            // TODO --DM-- Add loading overlay while it's loading
            console.log($state);
            $state.go('saved_posts', {}, {reload: true});
            console.log('showSavedPosts');
        }

        $scope.upvote = function(post) {
          if (Auth.isAuthenticated()) {
            PostsService.upvote(post.votes, post);
          }
        };

        $scope.downvote = function(post) {
          if (Auth.isAuthenticated()) {
            PostsService.downvote(post);
          }
        };

        $scope.savePost = function($event, post) {
            if (Auth.isAuthenticated()) {
                if (PostsService.isSaved(post)) {
                    PostsService.unsavePost($event, post, $scope.user);
                } else {
                    PostsService.savePost($event, post, $scope.user);
                }
            }
        };


    }]);
