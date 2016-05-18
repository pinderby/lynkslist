angular.module('lynkslistApp')
    .controller('ContentCtrl', ['$scope', '$http', '$state', '$stateParams', 'Auth', 'PostsService', 
            function($scope, $http, $state, $stateParams, Auth, PostsService) {


        if($('#route').data("model") == "list") {
            var name = $('#route').data("name");
            $http.get('/lists/' + name + "/posts").success( function(response) {
                $scope.posts = response; 
            });
        } else {
            $scope.posts = PostsService.posts;
        }

        for (var i = 0; i < $scope.posts.length; i++) {
            $scope.posts[i].published_relative = 
                moment($scope.posts[i].published_at).fromNow();
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

        $scope.incrementUpvotes = function(post) {
          PostsService.upvote(post);
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
