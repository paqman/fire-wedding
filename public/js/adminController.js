/*
 * Routes specifiques aux administrateurs
 */
weddingApplication.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/admin', {templateUrl : '/v/a/index', controller : AdminCtrl }).
		when('/admin/edit/:id', {templateUrl : '/v/s/inscription', controller : AdminEditCtrl }).	
		when('/admin/inscription/:id', {templateUrl : '/v/a/composer', controller : AdminLinkCtrl }).		
		when('/admin/logs', {templateUrl : '/v/a/logs', controller : AdminLogsCtrl }).
		when('/admin/stats', {templateUrl : '/v/a/stats', controller : AdminStatsCtrl });
}]);

/*
 * Controllers admin
 */
function AdminCtrl($scope, $routeParams, $http) {
	$scope.invite = {};
	$scope.invite.nb_enfants = 0;
	$scope.invite.nb_adultes = 1;
	$scope.showIcones = false;
	$scope.predicate = '';
	$scope.reverse = false;


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
					ins.invites = [{nom : 'Aucun invité associé.'}];
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
	
	$scope.updatePresence = function updatePresence(inscription, presence){
		var identifiant = parseInt(inscription.id);
		if(identifiant < 0)
			return ;
			
		$http({
			method: 'PUT', 
			url: '/a/presence/'+identifiant+'/'+presence
		}).
		success(function(data, status) {
			if(presence == 'repas'){
				inscription.presence_repas = (inscription.presence_repas+1) %2;
			}else if(presence == 'ceremonie'){
				inscription.presence_ceremonie = (inscription.presence_ceremonie+1) %2;
			}else if(presence == 'apero'){
				inscription.presence_apero = (inscription.presence_apero+1) %2;
			}
		}).
		error(function(data, status) {
			alert('Impossible de mettre a jour la presence : '+data);
		});
	};
	
	$scope.nombre = function nombre(fct){
		if($scope.inscriptions != undefined){
			var nb = 0;
			for(var i = 0; i< $scope.inscriptions.length; i++){
				var inscription = $scope.inscriptions[i];
				if(fct == 'a' && !!inscription.presence_apero){
					nb += inscription.nb_adultes + inscription.nb_enfants;
				}else if(fct == 'c' && !!inscription.presence_ceremonie){
					nb += inscription.nb_adultes + inscription.nb_enfants;
				}else if(fct == 'r' && !!inscription.presence_repas){
					nb += inscription.nb_adultes + inscription.nb_enfants;					
				}
			}
			return nb;
		}
	}
}

function AdminEditCtrl($scope, $routeParams, $http, $location){
	var id = $routeParams.id;
	
	$scope.inscription = new Object();
	$scope.inscription.nbEnfants = 0;
	$scope.inscription.nbAdultes = 1;
	
	$http({method: 'GET', url: '/a/inscription/' + id}).
	success(function(data, status) {
		$scope.inscription = data[0];
	}).
	error(function(data, status) {
		alert("Impossible de recuperer l'inscription : " + data);
	});
	
	
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
		$http({method: 'POST', url: '/s/inscription/'+$scope.inscription.id , data : $scope.inscription}).
		success(function(data, status) {
			$location.path('/admin');
		}).
		error(function(data, status) {
			alert('Erreur : '+data);
		});
	}
}

function AdminLinkCtrl($scope, $routeParams, $http){
	var id = $routeParams.id;
	
	// Details de l'inscription
	$http({method: 'GET', url: '/a/inscription/' + id}).
	success(function(data, status) {
		$scope.inscription = data[0];
	}).
	error(function(data, status) {
		alert("Impossible de recuperer l'inscription : " + data);
	});
	
	// Invites lies
	$http({method: 'GET', url: '/a/inscription/invite/' + id}).
	success(function(data, status) {
		$scope.inscription.invites = data;
	}).
	error(function(data, status) {
		alert("Impossible de recuperer les invites lies : " + data);
	});
	
	// Invites restants
	$http({method: 'GET', url: '/a/invite' }).
	success(function(data, status) {
		$scope.invites = data;
	}).
	error(function(data, status) {
		alert("Impossible de recuperer les invites : " + data);
	});
	
	$scope.preselect = function preselect(invite){
		if($scope.selection === invite){
			$http({method: 'POST', url: '/a/compose', data : {invite : invite.id, inscription : id } }).
			success(function(data, status) {
				if($scope.inscription.invites == undefined)
					$scope.inscription.invites = new Array();
					
				$scope.inscription.invites.push(invite);
				$scope.selection = undefined;
			}).
			error(function(data, status) {
				alert("Impossible de lier l'invite : " + data);
			});	
		}else{
			$scope.selection = invite;
		}
	}
	
	$scope.deselect = function deselect(invite){
		if($scope.selection === invite){
			$http({method: 'DELETE', url: '/a/compose', params : {invite : invite.id, inscription : id } }).
			success(function(data, status) {
				if(data){
					for (var i = $scope.inscription.invites.length-1; i >= 0; i--) {
					    if ($scope.inscription.invites[i].id == invite.id) {
					        $scope.inscription.invites.splice(i, 1);
					        break;
					    }
					}
					$scope.selection = undefined;
				}
			}).
			error(function(data, status) {
				alert("Impossible de supprimer le lien de l'invite : " + data);
			});	
		}else{
			$scope.selection = invite;
		}
	}
	
	$scope.isLinkedToInscription = function isLinkedToInscription(invite){
		if( $scope.inscription != undefined && $scope.inscription.invites != undefined){
			for( var i = 0; i < $scope.inscription.invites.length; i++ ){
					if($scope.inscription.invites[i].id ===invite.id){
						return false;
					}
				
			}
			
		}
		return true;
	}
	
	$scope.confirmer = function confirmer(){
		// Validation du formulaire
		$http({method: 'PUT', url: '/a/invite/'+$scope.selection.id , params : {nom : $scope.selection.nom, prenom : $scope.selection.prenom,
		presence_apero : $scope.selection.presence_apero, presence_repas : $scope.selection.presence_repas, presence_ceremonie : $scope.selection.presence_ceremonie }}).
		success(function(data, status) {
			$('#correctionInvite').modal('hide');
		}).
		error(function(data, status) {
			alert('Erreur : '+data);
		});
	}
	
}

function AdminLogsCtrl($scope, $http) {
	$scope.predicate = '';
	$scope.reverse = false;
        
	$http({method: 'GET', url: '/a/logs'}).
	success(function(data, status) {
		$scope.logs = data;
	}).
	error(function(data, status) {
		alert("Impossible de recuperer les logs : " + data);
	});
}

function AdminStatsCtrl($scope, $http, $q){
	$scope.stats = new Object();
	$scope.navettes = new Array();
	$scope.totaux = {};
	
	var promiseStart = $q.when('start');
	
	// Invites	
	var p1 = promiseStart.then(function (value) {
        return $http({method: 'GET', url: '/a/invite'}).
			success(function(data, status) {
				$scope.invites = data;
				$scope.stats.nbEnfantsInvites = $scope.stats.nbAdultesInvites = $scope.stats.nbPersonnesInvites = 0;
				$scope.stats.nbCeremoniesInvites = $scope.stats.nbRepasInvites = $scope.stats.nbAperosInvites = 0;
				for(var i = 0; i< $scope.invites.length; i++) {
					var invite = $scope.invites[i];
					$scope.stats.nbPersonnesInvites += invite.nb_adultes + invite.nb_enfants;

					if(invite.nb_adultes != undefined)
						$scope.stats.nbAdultesInvites += invite.nb_adultes;

					if(invite.nb_enfants != undefined)
						$scope.stats.nbEnfantsInvites += invite.nb_enfants;		
						
					if(!!invite.presence_apero)
						$scope.stats.nbAperosInvites += invite.nb_adultes + invite.nb_enfants;

					if(!!invite.presence_repas)
						$scope.stats.nbRepasInvites += invite.nb_adultes + invite.nb_enfants;
						
					if(!!invite.presence_ceremonie)
						$scope.stats.nbCeremoniesInvites += invite.nb_adultes + invite.nb_enfants;
						
				}
			});
	});
	
	// Inscriptions
	var p2 = p1.then(function (value) {
		return $http({method: 'GET', url: '/a/inscription' }).
		success(function(data, status) {
			$scope.inscriptions = data;
			
			$scope.stats.nbCouchagesInscrits = $scope.stats.nbDimanchesInscrits = $scope.stats.nbPersonnesInscrites = 0;
			$scope.stats.nbRepasInscrits = $scope.stats.nbCeremoniesInscrits = $scope.stats.nbAperosInscrits = 0;
			$scope.stats.nbEnfantsInscrits = $scope.stats.nbAdultesInscrits = 0;
			for(var i = 0; i< $scope.inscriptions.length; i++){
				var inscription = $scope.inscriptions[i];
				$scope.stats.nbPersonnesInscrites += inscription.nb_adultes + inscription.nb_enfants;
			
				if(inscription.nb_adultes != undefined)
					$scope.stats.nbAdultesInscrits += inscription.nb_adultes;

				if(inscription.nb_enfants != undefined)
					$scope.stats.nbEnfantsInscrits += inscription.nb_enfants;					
			
				if(inscription.nb_couchages > 0)
					$scope.stats.nbCouchagesInscrits += inscription.nb_couchages;
				
				if(inscription.presence_dimanche != 0)
					$scope.stats.nbDimanchesInscrits += inscription.nb_adultes + inscription.nb_enfants;
					
				if(!!inscription.presence_apero)
					$scope.stats.nbAperosInscrits += inscription.nb_adultes + inscription.nb_enfants;

				if(!!inscription.presence_repas)
					$scope.stats.nbRepasInscrits += inscription.nb_adultes + inscription.nb_enfants;
					
				if(!!inscription.presence_ceremonie)
					$scope.stats.nbCeremoniesInscrits += inscription.nb_adultes + inscription.nb_enfants;					
				
				if(inscription.besoin_navette != 0)
					$scope.navettes.push(inscription.lieu_navette + ' [ ' + inscription.prenom + ' ' + inscription.nom + ' ]');
				
			}

		});
	});
    
	var promiseEnd = p2.then(function (value) {
		// Invites et inscriptions disponibles
		$scope.stats.statut = ($scope.stats.nbPersonnesInscrites / $scope.stats.nbPersonnesInvites) * 100;
	}, function (reason) {
		alert('Erreur lors de la recuperations des donnees : ' + reason);
	    // Error in any request
	    return $q.reject(reason);
	});
}