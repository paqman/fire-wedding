/**
 * ROOT
 */
 app.get('/', function(request, response) {
 	response.render("entrer.html");
 });

app.get('/s/', function(request, response){
	response.render("index.html");
})

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
 	response.json(['OK']);
 });



/*
 * API Authentication filter
 */
 app.all('/a/*', function(request, response, next) {
 	if (request.session.authed && request.session.role == 'admin') {
 		next();
 	} else {
 		response.json(['must auth']);
 	}
 });

 app.all('/s/*', function(request, response, next) {
 	if (request.session.authed && request.session.role == 'admin' || request.session.role == 'user') {
 		next();
 	} else {
 		response.json(['must auth']);
 	}
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
 * Inscriptions
 */
 app.get('/s/inscription', function(request, response){
 	query = connection_r.query('SELECT * FROM `inscription`', function(err, rows, fields){
 		if(err) throw err;
 		else
 		{
 			response.json(rows);
 		}
 	});
 });

 app.use(function(request, response, next){
 	response.send(404, "Page inconnue !");
 });
