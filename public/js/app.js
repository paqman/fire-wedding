angular.module('wedding', []).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {templateUrl : '/v/s/inscription', controller : InscriptionCtrl }).
			when('/confirmation', {templateUrl : '/v/s/confirmation', controller : InscriptionCtrl }).
			when('/informations', {templateUrl : '/v/s/informations', controller : InscriptionCtrl }).
			when('/admin', {templateUrl : '/v/a/index', controller : AdminCtrl }).
			when('/admin/edit/:id', {templateUrl : '/v/s/inscription', controller : AdminEditCtrl }).	
			when('/admin/inscription/:id', {templateUrl : '/v/a/composer', controller : AdminLinkCtrl }).		
			when('/admin/logs', {templateUrl : '/v/a/logs', controller : AdminLogsCtrl }).
			when('/admin/stats', {templateUrl : '/v/a/stats', controller : AdminStatsCtrl }).
			otherwise({redirectTo : '/'});
	}])