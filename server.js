var express = require('express');
var Sequelize = require("sequelize");

var sequelize = new Sequelize('wedding', 'wedding_rw', 'w3dd1ng_rw', {
	host: "192.168.1.15",
	port: 8889
});

var Invite = sequelize.define('invite', {
	id: Sequelize.INTEGER,
	nom: Sequelize.STRING,
	prenom : Sequelize.STRING,
	nb_adultes : Sequelize.INTEGER,
	nb_enfants: Sequelize.INTEGER,
	presence_ceremonie : Sequelize.BOOLEAN,
	presence_repas : Sequelize.BOOLEAN,
	presence_apero : Sequelize.BOOLEAN
},  { freezeTableName: true });

var app = express();

app.get('/guests', function(req, res) {
	Invite.findAll()
	.success(function(models) {
		res.json(models);
	})
	.failure(function(error) {
		res.send(error);
	}); 
});
app.get('/guests/:id', function(req, res) {
	Invite.find(req.params.id)
	.success(function(models) {
		res.json(models);
	})
	.failure(function(error) {
		res.send(error);
	}); 
});

app.listen(3000);
console.log('Listening on port 3000...');