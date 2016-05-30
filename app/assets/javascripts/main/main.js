angular.module('lynkslistApp')
    .controller('ContentCtrl', ['$scope', '$http', '$state', '$stateParams', 'Auth', 'PostsService', 
            function($scope, $http, $state, $stateParams, Auth, PostsService) {

        $scope.orderProp = '-published_at';
        $scope.timescope = 7;
        $scope.posts = PostsService.posts;
        $scope.currentPage = 1;
        $scope.totalItems = 1000;

        if($('#route').data("page") != "") {
            $scope.currentPage = $('#route').data("page");
        }

        if($('#route').data("model") == "list") {
            var name = $('#route').data("name");
            PostsService.listName = name;
        }

        PostsService.sortPosts($scope.currentPage);

        $scope.$watch('currentPage', function(newValue, oldValue) {
            console.log("currentPage: " + $scope.currentPage);
            PostsService.getAll(newValue);
        });

        Auth.currentUser().then(function (user){
            $http.get('/users/' + user.id + '.json').success( function(response) {
                $scope.user = response;

                // Highlight all saved posts
                PostsService.saved_posts = $scope.user.saved_posts;
                for (var i = 0; i < $scope.user.saved_posts.length; i++) {                    
                    $('.save_stat_'+$scope.user.saved_posts[i].id).addClass('active');
                }

                // Highlight all votes
                PostsService.voted_posts = $scope.user.voted_posts;
                for (var i = 0; i < $scope.user.votes.length; i++) { 
                    if ($scope.user.votes[i].value == 1) {
                        $('.upvote_'+$scope.user.votes[i].post_id).addClass("active");
                    } else if ($scope.user.votes[i].value == -1) {
                        $('.downvote_'+$scope.user.votes[i].post_id).addClass("active");
                    } else {
                        console.log('Vote error: ' + $scope.user.votes[i].value);
                    }
                }
            });
        });

        $scope.updateSort = function() {
            switch($scope.orderProp) {
                case '-published_at':
                    PostsService.sort = 'recent';
                    break;
                case '-views':
                    PostsService.sort = 'viewed';
                    break;
                case '-points':
                    PostsService.sort = 'upvoted';
                    break;
                default:
                    PostsService.sort = 'recent';
            }

            PostsService.sortPosts($scope.currentPage);
        }

        $scope.updateTimescope = function() {
            PostsService.timescope = $scope.timescope;
            PostsService.sortPosts($scope.currentPage);
        }

        $scope.openLink = function(post) {
            $scope.articleUrl = post.canonical_url;
            $('#article-iframe').attr('src', post.canonical_url);
            PostsService.incrementViews(post);
            document.getElementById("myNav").style.left = "10%";
            document.getElementById("iframe-btn-container").style.left = "10%";
            $('.content_title').removeClass('active');
            $('.content_title_' + post.id).addClass('active');
        }

        $scope.closeNav = function() {
            document.getElementById("myNav").style.left = "100%";
            document.getElementById("iframe-btn-container").style.left = "100%";
            $('#article-iframe').attr('src', 'about:blank');
        }

        $scope.refresh = function() {
            PostsService.refreshPosts();
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
            PostsService.downvote(post.votes, post);
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
