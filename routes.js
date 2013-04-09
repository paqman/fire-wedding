require('./utils.js');

 app.use(function(request, response, next){
 	response.send(404, "Page inconnue !");
 });

/*
 * API Authentication filter
 */
 app.all('/a/*', function(request, response, next) {
 	if (isAdmin(request)) {
 		next();
 	} else {
 		response.send(403, 'Vous devez &ecirc;tre authentifi&eacute;.<br /><a href="/">Retour</a>');
 	}
 });

 app.all('/s/*', function(request, response, next) {
 	if (isAuthenticated(request)) {
 		next();
 	} else {
 		response.send(403, 'Vous devez &ecirc;tre authentifi&eacute;.<br /><a href="/">Retour</a>');
 	}
 });


/**
 * ROOT
 */
 app.get('/', function(request, response) {
 	response.render("entrer.html");
 });

app.get('/s/', function(request, response){
	if (isAuthenticated(request)) {
 		response.render("index.html", {locals : {admin : isAdmin(request), contact : settings.contact }});
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
		if(request.params.vue == "a" && isAdmin(request)){
			allowed = true;
		}else if(request.params.vue == "s" && isAuthenticated(request) ){
			allowed = true;
		}

		if(allowed){
			response.render(request.params.vue + '/' + request.params.nom + '.html', {locals : {admin : isAdmin(request) }});
		}else{
			response.send(404, "Page inconnue !");	
		}
	}else{
		response.send(404, "Page inconnue !");
	}
});

/**
 * AUTH methods
 */
 app.post('/entrer', function(request, response) {
 	var authent = { date_connexion : new Date(), ip : request.ip, navigateur : request.headers['user-agent'] };
 	
	var shasum = crypto.createHash('sha1');
	shasum.update(settings.credential.salt + request.body.password);
	var pass = shasum.digest('hex');

 	if (pass === settings.credential.user) {
 		request.session.regenerate(function(err){
		   	request.session.authed = true;
	 		request.session.role = 'user';
	 		authent.valide = authent.mot_de_passe = 1;
	 		var query = connection_rw.query('INSERT INTO log_connexion SET ?', authent, function(err, result){
				response.redirect('/s/');
			});
	 		
	 		return;
		 });
 	} else if (pass === settings.credential.admin) {
 		request.session.regenerate(function(err){
 			request.session.authed = true;
 			request.session.role = 'admin';
	 		authent.valide = authent.mot_de_passe = 1;
	 		var query = connection_rw.query('INSERT INTO log_connexion SET ?', authent, function(err, result){
				response.redirect('/s/');
			});
 			return;
		 });
 	} else {
 		authent.valide = 0; 
 		authent.mot_de_passe = request.body.password
 		var query = connection_rw.query('INSERT INTO log_connexion SET ?', authent, function(err, result){
			response.render("entrer.html", {locals : {errorMessage : "Mauvaises informations !"}});
		});		
 		return;
 	}

 });

 app.get('/quitter', function(request, response) {
 	request.session.authed = null;
 	request.session.role = null;
 	
 	response.redirect('/');
 });

/**
 * Invites
 */
 app.get('/a/invite/:opt?', function(request, response) {
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
 app.put('/a/invite/:id', function(request, response) {
 	var patt = regExName;

 	var errors = [];
 	if(isEmpty(request.query.nom)){
 		errors.push("Veuillez entrer votre nom.");
 	}else{
 		if(! patt.test(request.query.nom)){
			errors.push("Certains caracteres de votre nom sont interdits.");
	 	}
 	}

 	if(isEmpty(request.query.prenom)){
 		errors.push("Veuillez entrer votre prenom.");
 	}else{
 		if(! patt.test(request.query.prenom)){
			errors.push("Certains caracteres de votre prenom sont interdits.");
	 	}
 	}
 	
 	var presence_apero = !isEmpty(request.query.presence_apero) && (request.query.presence_apero == 'true' || request.query.presence_apero == '1' ) ? 1 : 0; 	
 	var presence_ceremonie = !isEmpty(request.query.presence_ceremonie) && (request.query.presence_ceremonie == 'true' || request.query.presence_ceremonie == '1' ) ? 1 : 0;
 	
 	var presence_repas = !isEmpty(request.query.presence_repas) && (request.query.presence_repas == 'true' || request.query.presence_repas == '1' ) ? 1 : 0;

 	
 	// Si on a des erreurs, on les retourne
 	if(errors.length > 0){
 		response.json(500, errors);
 		return;
 	}
	
	var query = connection_rw.query('UPDATE invite set nom=?, prenom=?, presence_apero=?, presence_ceremonie=?, presence_repas=? WHERE id = ?', [request.query.nom, request.query.prenom, presence_apero, presence_ceremonie, presence_repas, request.params.id], 
		function(err, rows, fields){
			if (err) throw err;
			
			response.json(rows.affectedRows);
			return;
		});
 });

app.post('/a/compose', function(request,response){
	if(isEmpty(request.body.invite) || isEmpty(request.body.inscription)){
 		response.json(400, "bad request");		
		return ;
	}
	
	var q = connection_r.query('SELECT id as val FROM compose WHERE id_invite = ? AND id_inscription = ?', 
		[request.body.invite, request.body.inscription], function(err, rows, fields){
		if(err) throw err;
		
		if(rows.length == 0){	
			var composition = {id_inscription : request.body.inscription, id_invite : request.body.invite, date_lien : new Date()};
			
			var query = connection_rw.query('INSERT INTO compose SET ?', composition, 
			function(err, result){
				if (err) throw err;
				
				response.json(composition);
				return;
			});	
		}

	});
});

app.delete('/a/compose', function(request,response){
	console.log(request.query);
	if(isEmpty(request.query.invite) || isEmpty(request.query.inscription)){
 		response.json(400, "bad request");		
		return ;
	}
	
	var q = connection_r.query('SELECT id as val FROM compose WHERE id_invite = ? AND id_inscription = ?', 
		[request.query.invite, request.query.inscription], function(err, rows, fields){
		if(err) throw err;
		
		if(rows.length > 0){	
			
			var query = connection_rw.query('DELETE FROM compose WHERE id_invite = ? AND id_inscription = ?', [request.query.invite, request.query.inscription], 
			function(err, result){
				if (err) throw err;
				
				response.json(true);
				return;
			});	
		}

	});
});

 /*
 * Enregistrement d'un nouvel invite
 */
 app.post('/a/invite', function(request, response){
 	var patt = regExName;
 	
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
app.get('/a/inscription/invite/:id', function(request, response){
	var invites = [];
 	var query = connection_r.query('SELECT i.* FROM `invite` i, `compose` c WHERE i.id = c.id_invite and c.id_inscription = ?', [request.params.id]);

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
 app.get('/a/inscription/:id?', function(request, response){
 	var invites = [];
 	var single = false;
 	if(request.params.id != null && parseInt(request.params.id) > 0){
 		single = true;
 		var query = connection_r.query('SELECT i.*, c.id_invite as invite FROM `inscription` i LEFT JOIN `compose` c ON c.id_inscription = i.id WHERE i.id = ? GROUP BY i.id', [request.params.id]);
 	}else {
 		 var query = connection_r.query('SELECT i.*, c.id_invite as invite FROM `inscription` i LEFT JOIN `compose` c ON c.id_inscription = i.id  GROUP BY i.id');	
 	}

 	query.on('error', function(err){
 		console.log('MYSQL error :' + err);
 	});

 	query.on('result', function(row){
 		if(single){
 			row = mapInscriptionDb2Screen(row);
 		}
 		invites.push(row);
 	});

 	query.on('end',function(){
 		response.json(invites);
 	});
 });
 
 /**
  * Update de la presence du bonhomme au repas
  */
  app.put('/a/presence/:id/:typePresence', function(request, response){
  	var type_presence = 'presence_apero'; 
//  	if(request.params.id != undefined)
	if(request.params.typePresence == 'ceremonie') {
		type_presence = 'presence_ceremonie';
	}else if(request.params.typePresence == 'repas') {
		type_presence = 'presence_repas';		
	}
	
	var q = connection_r.query('SELECT '+type_presence+' as val FROM inscription WHERE id = ?', [request.params.id], function(err, rows, fields){
		if(err) throw err;
		var val = rows[0].val;
		val = (val+1) %2;
		
		var query = connection_rw.query('UPDATE inscription set '+type_presence+'=? WHERE id = ?', [val, request.params.id], 
		function(err, rows, fields){
			if (err) throw err;
			
			response.json(rows.affectedRows);
			return;
		});

	});
  });

/*
 * Enregistrement d'une inscription
 */
 app.post('/s/inscription/:id?', function(request, response){
 	var patt = regExName;

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

 	if(isAdmin(request)){
 		inscription.presence_apero = isEmpty(request.body.presence_apero) || !request.body.presence_apero ? 0 : 1;
 		inscription.presence_ceremonie = isEmpty(request.body.presence_ceremonie) || !request.body.presence_ceremonie ? 0 : 1;
 		inscription.presence_repas = isEmpty(request.body.presence_repas) || !request.body.presence_repas ? 0 : 1;
 	}else{
 		inscription.presence_apero = inscription.presence_ceremonie = inscription.presence_repas = 0;
 	}

	if(request.params.id != undefined && isAdmin(request)){
		var query = connection_rw.query('UPDATE inscription SET ? WHERE id = '+connection_rw.escape(request.params.id), inscription, function(err, result){
			response.json(result);
		});
		
	}else{	
	
	 	inscription.date_inscription = new Date();
		inscription.is_active = true;
		inscription.ip = request.ip;
	
		if(!isAdmin(request)){
			var checkQuery = connection_rw.query('SELECT * FROM inscription WHERE ip = ?', [request.ip], function(err, rows, fields){
				if (err) throw err;
			
				if(rows.length >= 3){
					response.json(400, ['Vous avez depasse le nombre d\'inscriptions possibles. Merci de nous contacter par e-mail.']);
					return;
				}
				// Enregistrement en DB
				var query = connection_rw.query('INSERT INTO inscription SET ?', inscription, function(err, result){
					response.json(inscription);
				});
				
				return;
			});
		}else{
			// Enregistrement en DB
			var query = connection_rw.query('INSERT INTO inscription SET ?', inscription, function(err, result){
				response.json(inscription);
			});
		}

	return;
	}
 });
 
 /**
  * LOGS
  */
app.get('/a/logs', function(request, response){
	var logs = [];
	var query = connection_r.query('SELECT * FROM log_connexion ORDER BY date_connexion DESC');	

 	query.on('error', function(err){
 		console.log('MYSQL error :' + err);
 	});

 	query.on('result', function(row){
 		logs.push(row);
 	});

 	query.on('end',function(){
 		response.json(logs);
 	});
});
	