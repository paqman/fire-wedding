require('./utils.js');

 app.use(function(request, response, next){
 	response.send(404, "Page inconnue !");
 });

/*
 * API Authentication filter
 */
 app.all('/a/*', function(request, response, next) {
 	if (request.session.authed && request.session.role == 'admin') {
 		next();
 	} else {
 		response.send(403, 'must auth');
 	}
 });

 app.all('/s/*', function(request, response, next) {
 	if (request.session.authed && request.session.role == 'admin' || request.session.role == 'user') {
 		next();
 	} else {
 		response.send(403, 'must auth');
 	}
 });


/**
 * ROOT
 */
 app.get('/', function(request, response) {
 	response.render("entrer.html");
 });

app.get('/s/', function(request, response){
	if (request.session.authed && request.session.role == 'admin' || request.session.role == 'user') {
 		response.render("index.html", {locals : {admin : (request.session.role =='admin'), contact : settings.contact }});
 	} else {
 		response.redirect('/');
 		//response.send(403, 'Vous devez vous authentifier.<br /><a href="/">Retour</a>');
 	}
	
})

/**
 * Methode de recuperation des vues
 */
app.get('/v/:vue/:nom', function(request, response){
	require('ejs').clearCache();
	if(request.params.vue != undefined && request.params.nom != undefined){
		var allowed = false;
		if(request.params.vue == "a" && request.session.role == 'admin'){
			allowed = true;
		}else if(request.params.vue == "s" && (request.session.role == 'user' || request.session.role == 'admin') ){
			allowed = true;
		}

		if(allowed){
			response.render(request.params.vue + '/' + request.params.nom + '.html');
		}else{
			response.send(404, "Vous n'avez pas les droits !");	
		}
	}else{
		response.send(404, "Page inconnue !");
	}
});

/**
 * AUTH methods
 */
 app.post('/entrer', function(request, response) {

 	console.info('login PARAM: ', request.body);

 	if (GLOBAL.no_auth || request.body.password == 'emilie') {
 		request.session.authed = true;
 		request.session.role = 'user';
 		response.redirect('/s/');
 	} else if (GLOBAL.no_auth || request.body.password == 'michael') {
 		request.session.authed = true;
 		request.session.role = 'admin';
 		response.redirect('/s/');
 	} else {
 		response.render("entrer.html", {locals : {errorMessage : "Mauvaises informations !"}});
 	}

 });

 app.get('/quitter', function(request, response) {
 	request.session.authed = null;
 	request.session.role = null;
 	
 	response.redirect('/');
 });

/*
 * Invites
 */
 app.get('/invite/:opt?', function(request, response) {
 	var query;
 	var invites = [];

	// On ne recupere que les invites qui n'ont pas d'inscription
 	if(request.params.opt != undefined && request.params.opt == "seul")
 	{
 		query = connection_r.query('SELECT i.* FROM `invite` i WHERE i.id NOT IN (SELECT c.id_invite FROM `compose` c)');
 	}else{
 		query = connection_r.query('SELECT * FROM `invite`');
 	}

 	query.on('error', function(err){
 		console.log('MYSQL error :' + err);
 	});

 	query.on('result', function(row){
 		invites.push(row);
 	});

 	query.on('end',function(){
 		response.json(invites);
 	});
 });

 // UPDATE
 app.put('/invite', function(request, response){

 });

 /*
 * Enregistrement d'un nouvel invite
 */
 app.post('/a/invite', function(request, response){
 	var patt = /^[a-zA-Z0-9!\?-_:\',\.\+\s]*$/im;
 	
 	var invite = new Object();
 	var errors = [];
 	if(isEmpty(request.body.nom)){
 		errors.push("Veuillez entrer votre nom.");
 	}else{
 		if(patt.test(request.body.nom)){
 			invite.nom = request.body.nom;
	 	}else{
			errors.push("Certains caracteres de votre nom sont interdits.");
	 	}
 	}

 	if(isEmpty(request.body.prenom)){
 		errors.push("Veuillez entrer votre prenom.");
 	}else{
 		if(patt.test(request.body.prenom)){
 			invite.prenom = request.body.prenom;
	 	}else{
			errors.push("Certains caracteres de votre prenom sont interdits.");
	 	}
 		
 	}

 	if(isEmpty(request.body.nb_enfants) && between(request.body.nb_enfants, 0, 5)) {
 		errors.push("Indiquez le nombre d'enfants.");
 	}else{
 		invite.nb_enfants = request.body.nb_enfants;
 	}

 	if(isEmpty(request.body.nb_adultes) && between(request.body.nb_adultes, 1, 6)) {
 		errors.push("Indiquez le nombre d'adultes.");
 	}else{
 		invite.nb_adultes = request.body.nb_adultes;
 	}

	invite.presence_ceremonie = isEmpty(request.body.presence_ceremonie) || !request.body.presence_ceremonie ? 0 : 1;
	invite.presence_repas = isEmpty(request.body.presence_repas) || !request.body.presence_repas ? 0 : 1;
	invite.presence_apero = isEmpty(request.body.presence_apero) || !request.body.presence_apero ? 0 : 1;

 	// Si on a des erreurs, on les retourne
 	if(errors.length > 0){
 		response.json(500, errors);
 		return;
 	}

 	// Enregistrement en DB
	var query = connection_rw.query('INSERT INTO invite SET ?', invite, function(err, result){
		response.json(invite);
	});
   
 });

/*
 * Recupere les invites lies a une inscription
*/
app.get('/a/inscription/invite/:opt', function(request, response){
	var invites = [];
 	var query = connection_r.query('SELECT i.* FROM `invite` i, `compose` c WHERE i.id = c.id_invite and c.id_inscription = ?', [request.params.opt]);

 	query.on('error', function(err){
 		console.log('MYSQL error :' + err);
 	});

 	query.on('result', function(row){
 		invites.push(row);
 	});

 	query.on('end',function(){
 		response.json(invites);
 	});
});

/*
 * Inscriptions
 */
 app.get('/a/inscription', function(request, response){
 	var invites = [];
 	var query = connection_r.query('SELECT i.*, c.id_invite as invite FROM `inscription` i LEFT JOIN `compose` c ON c.id_inscription = i.id  group by i.id');

 	query.on('error', function(err){
 		console.log('MYSQL error :' + err);
 	});

 	query.on('result', function(row){
 		invites.push(row);
 	});

 	query.on('end',function(){
 		response.json(invites);
 	});
 });

/*
 * Enregistrement d'une inscription
 */
 app.post('/s/inscription', function(request, response){
 	var patt = /^[a-zA-Z0-9!\?-_:\',\.\+\s]*$/im;
 	console.log(request.body);
 	var inscription = new Object();
 	var errors = [];
 	if(isEmpty(request.body.nom)){
 		errors.push("Veuillez entrer votre nom.");
 	}else{
 		if(patt.test(request.body.nom)){
 			inscription.nom = request.body.nom;
	 	}else{
			errors.push("Certains caracteres de votre nom sont interdits.");
	 	}
 	}

 	if(isEmpty(request.body.prenom)){
 		errors.push("Veuillez entrer votre prenom.");
 	}else{
 		if(patt.test(request.body.prenom)){
 			inscription.prenom = request.body.prenom;
	 	}else{
			errors.push("Certains caracteres de votre prenom sont interdits.");
	 	}
 		
 	}

 	if(isEmpty(request.body.nbEnfants) && between(request.body.nbEnfants, 0, 5)) {
 		errors.push("Indiquez le nombre d'enfants.");
 	}else{
 		inscription.nb_enfants = request.body.nbEnfants;
 	}

 	if(isEmpty(request.body.nbAdultes) && between(request.body.nbAdultes, 1, 6)) {
 		errors.push("Indiquez le nombre d'adultes.");
 	}else{
 		inscription.nb_adultes = request.body.nbAdultes;
 	}

 	if(!isEmpty(request.body.couchageRequis) && isEmpty(request.body.nbCouchages)){
 		errors.push("Indiquez le nombre de couchages.");
 	}else{
 		inscription.nb_couchages = isEmpty(request.body.couchageRequis) || !request.body.couchageRequis ? 0 : isEmpty(request.body.nbCouchages) ? 0 : request.body.nbCouchages;
 	}
 	
 	if(request.body.besoinNavette && isEmpty(request.body.lieuNavette)){
		errors.push("Indiquez votre lieu de retour.");
	}else{
		inscription.besoin_navette = isEmpty(request.body.besoinNavette) || !request.body.besoinNavette ? 0 : 1;
		inscription.lieu_navette = request.body.lieuNavette;
	}

	inscription.presence_dimanche = isEmpty(request.body.presenceDimanche) || !request.body.presenceDimanche ? 0 : 1;

	if(isEmpty(request.body.commentaires) || patt.test(request.body.commentaires)){
		inscription.commentaires = request.body.commentaires;
 	}else{
		errors.push("Certains caracteres de votre commentaire sont interdits.");
 	}

 	// Si on a des erreurs, on les retourne
 	if(errors.length > 0){
 		response.json(500, errors);
 		return;
 	}

 	inscription.date_inscription = new Date();
	inscription.is_active = true;
	inscription.ip = request.ip;

 	// Enregistrement en DB
	var query = connection_rw.query('INSERT INTO inscription SET ?', inscription, function(err, result){
		response.json(inscription);
	});
   
 });
