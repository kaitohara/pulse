var templateUrl, ngController;
if (screen.width <= 800) {
	console.log('MOBILE!!!!')
	templateUrl =  '/pre-build/home/mobile.html';
	ngController = 'MobileHomeController';
} else {
	templateUrl = '/pre-build/home/home.html';
	ngController = 'HomeController';
}
app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: templateUrl,
        controller: ngController
    });
});