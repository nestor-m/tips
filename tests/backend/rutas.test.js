
var Idea = require("../../models/Ideas.js");
var Usuario = require("../../models/Usuarios.js");
require("../../models/Actividades.js");
require("../../models/Comentarios.js");
require("../../models/Materias.js");



var should = require("chai").should();
var router = require("../../routes/index.js");
var express = require("express");
var app = express();
app.use(require('body-parser').json())

var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
var request = require("supertest");

app.use("/", router);


describe("router Ideas", function() {
	before(function(done) {
		mockgoose(mongoose).then(function() {
			mongoose.connect("mongodb://localhost/testingRutas");
			done();
		})
	});

	afterEach(function(done) {
		mockgoose.reset(done);
	});

	after(function(done){
		mongoose.disconnect(done);
	});

	describe("registro del usuario al sistema", function(){
		describe("POST /registro", function(){
			it("debe registrar a un usuario anadiendolo a la bbdd", function(done){
				request(app)
				.post('/registro')
				.send({usuario:'docente2',password:'docente2',rol:'DOCENTE'})
      			.expect(200)
      			.end(function(err, res){
      				should.not.exist(err);
      				done();
      			});
			});
		});
	});


	context("con el usuario docente2 registrado", function(){
		before(function(done){
			request(app)
			.post('/registro')
			.send({usuario:'docente2',password:'docente2',rol:'DOCENTE'})
			.expect(200)
			.end(done);
		});
		
		describe("POST /login", function(){
			it("debe loguear al usuario existente correctamente", function(done){
				request(app)
				.post('/login')
				.send({usuario:'docente2',password:'docente2'})
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					res.body.should.have.property('token');
					done();
				});
			});
		});
	});

	context("sin que haga falta un rol especifico", function(){
		var ideanueva;
		var ideaeliminada;

		before(function(done) {

			ideanueva = new Idea();
			ideanueva.titulo = "Nueva Idea";
	  		ideanueva.descripcion = "descripcion de nueva idea";
	  		ideanueva.autor =  "Guido";
	  		ideanueva.postulante = "postulantePorDefecto";
	  		ideanueva.save();

	  		ideaeliminada = new Idea();
	  		ideaeliminada.titulo = "titulo de la idea eliminada";
	  		ideaeliminada.descripcion = "descripcion de la idea eliminada";
	  		ideaeliminada.autor = "El autor";
	  		ideaeliminada.estado = "ELIMINADA";
	  		ideaeliminada.postulante = "alguien";
	  		ideaeliminada.save();

	  		done();
		});

		describe("GET /ideas", function() {
		it("debe retornarme la lista de ideas no eliminadas", function(done) {
			request(app)
				.get("/ideas")
				.expect(200)
				.end(function(err,response){
					should.not.exist(err);
					response.body.should.be.array;
					response.body.should.have.lengthOf(1);
					done();
				});
			});
		});
	});

	context("con docente2 registrado y logueado", function(){
		var token;
		before(function(done){
			request(app)
			.post('/registro')
			.send({usuario:'docente2',password:'docente2',rol:'DOCENTE'})
			.expect(200)
			.end(function(err, response){
				request(app)
				.post('/login')
				.send({usuario:'docente2',password:'docente2'})
				.expect(200)
				.end(function(err, res){
					token = res.body.token;	
					done();
				});
			});
		});

		describe("POST /ideas", function(){
			it("post /ideas debe crear una nueva idea con los valores determinados", function(done){
				request(app)
					.post("/ideas")
					.set('Authorization', 'Bearer ' + token)
					.send({titulo: 'titulo de una idea', descripcion: 'una descripcion de una idea', materias: []})
					.expect(200)
					.end(function(err, res){
						request(app)
						.get("/ideas")
						.expect(200)
						.end(function(err,response){
							response.body.should.be.array;
							response.body.should.have.lengthOf(1);
							done();
						});
					});
			});
		});
	});

	context("con usuario1 registrado y logueado", function(){
		var token;
		before(function(done){
			request(app)
			.post('/registro')
			.send({usuario:'usuario1',password:'usuario1',rol:'USUARIO'})
			.expect(200)
			.end(function(err, response){
				request(app)
				.post('/login')
				.send({usuario:'usuario1',password:'usuario1'})
				.expect(200)
				.end(function(err, res){
					token = res.body.token;	
					done();
				});
			});
		});

		it("post /ideas no debe crear una nueva idea porque su rol no se lo permite", function(){
			request(app)
				.post("/ideas")
				.set('Authorization', 'Bearer ' + token)
				.send({titulo: 'titulo de una idea', descripcion: 'una descripcion de una idea', materias: []})
				.expect(200)
				.end(function(err, res){
					should.exist(err);
					res.status.should.equal(401);	
				});
		});
	});
});