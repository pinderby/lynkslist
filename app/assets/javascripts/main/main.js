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
            PostsService.sortPosts(newValue);
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
            PostsService.refreshPosts($scope.currentPage);
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
                    PostsService.unsavePost($event, post);
                } else {
                    PostsService.savePost($event, post);
                }
            }
        };


    }]);
