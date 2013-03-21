angular.module('wedding', []).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {templateUrl : '/v/s/inscription', controller : InscriptionCtrl }).
			when('/admin', {templateUrl : '/v/a/index', controller : AdminCtrl }).
			otherwise({redirectTo : '/'});
	}])