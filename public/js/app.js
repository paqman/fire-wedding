angular.module('wedding', []).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {templateUrl : '/v/s/inscription', controller : InscriptionCtrl }).
			when('/confirmation', {templateUrl : '/v/s/confirmation', controller : InscriptionCtrl }).
			when('/informations', {templateUrl : '/v/s/informations', controller : InscriptionCtrl }).
			when('/admin', {templateUrl : '/v/a/index', controller : AdminCtrl }).
			otherwise({redirectTo : '/'});
	}])