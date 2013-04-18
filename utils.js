
/**
 * Determine si une chaine est vide ou non
 */
 GLOBAL.isEmpty = function isEmpty(v){
 	return v == undefined || v.length < 1;
 }


/**
 * Determine si le nombre est entre les deux passes en parametre
 */
 GLOBAL.between = function between(valeur, min, max) {
 	return (parseInt(valeur) >= parseInt(min) && parseInt(valeur) <= parseInt(max));
 }

 GLOBAL.isAdmin = function isAdmin(req) {
 	return (req.session.authed && req.session.role === 'admin');
 }

 GLOBAL.isUser = function isUser(req){
 	return (req.session.authed && req.session.role === 'user');	
 }
 
 GLOBAL.isInvite = function isInvite(req) {
 	return (req.session.authed && req.session.role === 'invite');
 }

 GLOBAL.isAuthenticated = function isAuthenticated(req){
 	return (isAdmin(req) || isUser(req) || isInvite(req));
 }
 
 GLOBAL.mapInscriptionDb2Screen = function mapInscriptionDb2Screen(row) {
 	if (row == undefined)
 		return undefined;
 		
	row.couchageRequis = (row.nb_couchages > 0);
	row.nbCouchages = row.nb_couchages;			
	row.nbAdultes = row.nb_adultes;	
	row.nbEnfants = row.nb_enfants;
	row.presenceDimanche = row.presence_dimanche == 1;
	row.besoinNavette = row.besoin_navette == 1;
	row.lieuNavette = row.lieu_navette;
	row.presence_apero = !!row.presence_apero;
	row.presence_repas = !!row.presence_repas;
	row.presence_ceremonie = !!row.presence_ceremonie;			

	delete row.besoin_navette, row.lieu_navette, row.presence_dimanche, row.nb_enfants, row.nb_adultes, row.nb_couchages;

	return row;
}

GLOBAL.getIp = function getIp(request){
	if(request.headers['x-forwarded-for'] != undefined){
		return request.headers['x-forwarded-for'];
	}
	
	return request.ip;
}

GLOBAL.regExName = /^[a-z\u00E0-\u00FCA-Z0-9!\?\-_:\',\.\+\s]*$/im;