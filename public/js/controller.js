function InscriptionCtrl($scope, $routeParams, $http, $location) {

	$scope.inscription = new Object();
	$scope.inscription.nbEnfants = 0;
	$scope.inscription.nbAdultes = 1;
	//$scope.nbCouchagesUpdate();

	$scope.isFormValid = function isFormValid(showErrors){
		var errors = $scope.getErrors();

		if(showErrors){
			$scope.erreurs = errors;
		}
		return (errors.length == 0);
	}

	$scope.nbPersonnes = function nbPersonnes(){
		return parseInt($scope.inscription.nbAdultes) + parseInt($scope.inscription.nbEnfants);
	}

	$scope.getErrors = function getErrors(){
		var errors = [];
		var inscription = $scope.inscription;
		
		if(inscription.nom == undefined || inscription.nom.length == 0){
			errors.push("Le nom est requis.");
		}

		if(inscription.prenom == undefined || inscription.prenom.length == 0){
			errors.push("Le prénom est requis.");
		}

		if(inscription.besoinNavette && (inscription.lieuNavette == undefined || inscription.lieuNavette.length == 0) ){
			errors.push("Indiquez votre lieu de retour.");	
		}

		return errors;
	}

	$scope.confirmer = function confirmer(){
		if(! $scope.isFormValid(true))
			return false;

		// Validation du formulaire
		$http({method: 'POST', url: '/s/inscription', data : $scope.inscription}).
		success(function(data, status) {
			$location.path('/confirmation');
		}).
		error(function(data, status) {
			alert('Erreur : '+data);
		});
	}
}

function InformationsCtrl($scope, $timeout){
	$scope.myMarkers = [];
	$timeout(function(){
		if($scope.isInvite != undefined && !$scope.isInvite){
		$scope.myMarkers.push({title : "<span>C&eacute;r&eacute;monie</span><br />Ferme familiale<br />57 route de dambenois<br />90400 TREVENANS", place : new google.maps.Marker({map : $scope.myMap, position : new google.maps.LatLng(47.551857,6.867605), title : "Ceremonie"})});
		}
		$scope.myMarkers.push({place : new google.maps.Marker({map : $scope.myMap, position : new google.maps.LatLng(47.557827, 6.852212)}), title : "<span>Mairie de ch&acirc;tenois</span><br />18 voie du tram<br />90700 CH&Acirc;TENOIS LES FORGES"});
	$scope.myMarkers.push({place : new google.maps.Marker({map : $scope.myMap, position : new google.maps.LatLng(47.659123, 6.879136)}), title : "<span>Vin d'honneur</span><br />La MIEL (La Maison Intercommunale de l'Enfance et des Loisirs)<br />Rue des Eygras<br />90300 OFFEMONT"});
	}, 2000);
	 
	$scope.mapOptions = {
	  center: new google.maps.LatLng(47.614264,6.890144),
	  zoom: 11,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	 
}