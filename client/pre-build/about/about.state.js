app.config(function($stateProvider){
	$stateProvider.state('about', {
		url: '/about',
		templateUrl: '/pre-build/about/about.html',
		controller: 'AboutController'
	})
})