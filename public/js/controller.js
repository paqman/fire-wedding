function InscriptionCtrl($scope, $routeParams, $http) {

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
			errors.push("Le pr&eacute;nom est requis.");
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
			alert('ok');
			$scope.data = data;
		}).
		error(function(data, status) {
			alert('KO'+data);
		});
	}
}

function AdminCtrl($scope, $routeParams, $http) {

	$http({method: 'GET', url: '/a/inscription'}).
		success(function(data, status) {
			$scope.inscriptions = data;
			
			var totaux = {couchages : 0, dimanche : 0, navette : 0, personnes : 0};
			for(var i = 0; i< $scope.inscriptions.length; i++){
				var inscription = $scope.inscriptions[i];
				
				var nbPersonnes = inscription.nb_adultes + inscription.nb_enfants;
				totaux.personnes += nbPersonnes;
				
				if(inscription.nb_couchages > 0){
					totaux.couchages += inscription.nb_couchages;
				}
				if(inscription.presence_dimanche != 0){
					totaux.dimanche += nbPersonnes;
				}
				if(inscription.besoin_navette != 0){
					totaux.navette += 1;
				}
			}
			$scope.totaux = totaux;
		}).
		error(function(data, status) {
			alert("Impossible de recupere les inscriptions : " + data);
		});


}