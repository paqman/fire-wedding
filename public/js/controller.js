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
			alert('Votre inscription a bien &eacute;t&eacute; prise en compte !');
			$scope.data = data;
		}).
		error(function(data, status) {
			alert('Erreur : '+data);
		});
	}
}

function AdminCtrl($scope, $routeParams, $http) {
	$scope.invite = {};
	$scope.invite.nb_enfants = 0;
	$scope.invite.nb_adultes = 1;

	$scope.nbPersonnes = function nbPersonnes(){
		return parseInt($scope.invite.nb_adultes) + parseInt($scope.invite.nb_enfants);
	}

	$http({method: 'GET', url: '/a/inscription'}).
		success(function(data, status) {
			$scope.inscriptions = data;
			
			var totaux = {couchages : 0, dimanche : 0, navette : 0, personnes : 0, enfants : 0, adultes : 0};
			for(var i = 0; i< $scope.inscriptions.length; i++){
				var inscription = $scope.inscriptions[i];
				
				totaux.adultes += inscription.nb_adultes;
				totaux.enfants += inscription.nb_enfants;
				totaux.personnes += inscription.nb_adultes + inscription.nb_enfants;
				
				if(inscription.nb_couchages > 0){
					totaux.couchages += inscription.nb_couchages;
				}
				if(inscription.presence_dimanche != 0){
					totaux.dimanche += inscription.nb_adultes + inscription.nb_enfants;
				}
				if(inscription.besoin_navette != 0){
					totaux.navette += 1;
				}
			}
			$scope.totaux = totaux;
		}).
		error(function(data, status) {
			alert("Impossible de recuperer les inscriptions : " + data);
		});

	$scope.enregistrer = function enregistrer(){

		// Validation du formulaire
		$http({method: 'POST', url: '/a/invite', data : $scope.invite}).
		success(function(data, status) {
			if(status == 200)
			{
				alert('ok');
				$scope.data = data;
				$scope.invite = {};
				$scope.invite.nb_enfants = 0;
				$scope.invite.nb_adultes = 1;
			}else{
				alert('KO '+data);	
			}
		}).
		error(function(data, status) {
			alert('KO '+data);
		});
	}

	$scope.switchInvite = function switchInvite(ins){
		if(ins.invites == undefined){
			$http({
				method: 'GET', 
				url: '/a/inscription/invite/'+ins.id
			}).
			success(function(data, status) {
				if(data.length < 1) {
					ins.invites = [{nom : 'Aucun invite associe.'}];
				}else{
					ins.invites = data;
				}
			}).
			error(function(data, status) {
				alert('Impossible de recuperer les invites : '+data);
			});
		}

		if(ins.view == undefined || ins.view == "commentaires"){
			ins.view = "invites";
		}else{
			ins.view = "commentaires";
		}
	};

}