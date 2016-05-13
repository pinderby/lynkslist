angular.module('lynkslistApp')
    .controller('ContentCtrl', ['$scope', '$http', '$state', '$stateParams', 'Auth', 'posts', 
            function($scope, $http, $state, $stateParams, Auth, posts) {

        contains = function(a, obj) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].id == obj.id) {
                    return true;
                }
            }
            return false;
        }

        if($('#route').data("model") == "list") {
            var name = $('#route').data("name");
            $http.get('/lists/' + name + "/posts").success( function(response) {
                $scope.posts = response; 
            });
        } else {
            $scope.posts = posts.posts;
        }

        Auth.currentUser().then(function (user){
            $http.get('/users/' + user.id + '.json').success( function(response) {
                $scope.user = response;
                for (var i = 0; i < $scope.posts.length; i++) {
                    is_saved = contains($scope.user.saved_posts, $scope.posts[i]);
                    $scope.posts[i].saved_by_user = is_saved;
                }
            });
        });



        $scope.openLink = function(post) {
            $scope.articleUrl = post.canonical_url;
            $('#article-iframe').attr('src', post.canonical_url);
            posts.incrementViews(post);
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
          posts.upvote(post);
        };

        $scope.savePost = function($event, post) {
            console.log($event);
            console.log(post);
            console.log(post.saved_by_user);
            console.log($scope.user);
            var post_saved = contains($scope.user.saved_posts, post);
            if (post_saved) {
                // posts.savePost($event, post, $scope.user);
                
            } else {
                // posts.unsavePost($event, post, $scope.user);
            }
            
        };


    }]);
