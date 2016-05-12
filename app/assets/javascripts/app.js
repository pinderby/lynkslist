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
					postPromise: ['posts', function(posts){
						return posts.getAll();
					}]
				}
			})
			.state('saved_posts', {
				url: '/saved_posts',
				templateUrl: 'main/_main.html',
				controller: 'ContentCtrl',
				resolve: {
					postPromise: ['posts', 'Auth', function(posts, Auth){
						Auth.currentUser().then(function (user){
							return posts.getSavedPosts(user.id);
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