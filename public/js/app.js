var weddingApplication = angular.module('wedding', ['ui']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/inscription', {templateUrl : '/v/s/inscription', controller : InscriptionCtrl }).
			when('/confirmation', {templateUrl : '/v/s/confirmation', controller : InscriptionCtrl }).
			when('/', {templateUrl : '/v/s/informations', controller : InformationsCtrl }).
			otherwise({redirectTo : '/'});
	}]);