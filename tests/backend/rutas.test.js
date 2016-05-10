
var Idea = require("../../models/Ideas.js");
var Usuario = require("../../models/Usuarios.js");
require("../../models/Actividades.js");


var should = require("chai").should();
var router = require("../../routes/index.js");
var express = require("express");

var app = express();
app.use("/", router);
app.use(require('body-parser').json())

var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
var request = require("supertest");


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

	var ideanueva;
	var ideaeliminada;

	beforeEach(function(done) {

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

	describe("POST /registro", function(){
		//var server = request.agent("http://localhost/testingRutas");
		it("debe registrar a un usuario anadiendolo a la bbdd", function(done){

			request(app)
				.post('/registro')
				.send({usuario:'docente2',password:'docente2',rol:'DOCENTE'})
      			.expect(200)
      			.end(function(err, res){
      				console.log(res);
      				should.not.exist(err);
      				done();
      			});
		});
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

	/*
	
	describe("POST /ideas", function() {

		var token;

		before(function(done){
			var cuenta = {
  				"usuario": "docente",
  				"password": "docente"
			};
			request.
				post('/login')
    			.send(theAccount)
    			.end(function (err, res) {
	     			if (err) {
	        			throw err;
	      			}
	      			token = res.body.token;
				});
		});

		

		it("post /ideas debe crear una nueva idea con los valores determinados", function(done){
			request(app)
				.post("/ideas")
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
		});

	*/
});


