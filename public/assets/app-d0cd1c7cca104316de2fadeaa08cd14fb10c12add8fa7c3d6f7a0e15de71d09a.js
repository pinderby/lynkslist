'use strict';

/* App Module */

var lynkslistApp = angular.module('lynkslistApp', [
	'ui.router',
	'templates',
	'Devise',
	'lynkslistServices'
]);

lynkslistApp.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('main', {
				url: '/main',
				templateUrl: 'main/_main.html',
				controller: 'ContentCtrl',
				resolve: {
					postPromise: ['PostsService', function(PostsService){
						return PostsService.getAll();
					}]
				}
			})
			.state('saved_posts', {
				url: '/saved_posts',
				templateUrl: 'main/_main.html',
				controller: 'ContentCtrl',
				resolve: {
					postPromise: ['PostsService', 'Auth', function(PostsService, Auth){
						Auth.currentUser().then(function (user){
							return PostsService.getSavedPosts(user.id);
						});
					}]
				}
			})
			.state('login', {
		    	url: '/login',
		    	templateUrl: 'auth/_login.html',
		    	controller: 'AuthCtrl',
		    	onEnter: ['$state', 'Auth', function($state, Auth) {
					Auth.currentUser().then(function (){
						$state.go('main');
					})
				}]
		    })
		    .state('register', {
		    	url: '/register',
		    	templateUrl: 'auth/_signup.html',
		    	controller: 'AuthCtrl',
		    	onEnter: ['$state', 'Auth', function($state, Auth) {
					Auth.currentUser().then(function (){
						$state.go('main');
					})
				}]
		    });

		$urlRouterProvider.otherwise('main');
	}
]);
