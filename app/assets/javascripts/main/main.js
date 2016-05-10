angular.module('lynkslistApp')
    .controller('ContentCtrl', ['$scope', '$http', '$state', '$stateParams', 'posts', 
            function($scope, $http, $state, $stateParams, posts) {
        

        if($('#route').data("model") == "list") {
            var name = $('#route').data("name");
            $http.get('/lists/' + name + "/posts").success( function(response) {
                $scope.posts = response; 
            });
        } else {
            $scope.posts = posts.posts;
        }

        $scope.openLink = function(post) {
            $scope.articleUrl = post.canonical_url;
            $('#article-iframe').attr('src', post.canonical_url);
            posts.increment_views(post);
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

        $scope.incrementUpvotes = function(post) {
          posts.upvote(post);
        };

    }]);
