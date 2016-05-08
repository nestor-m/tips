<<<<<<< Updated upstream
var Idea = require("../../models/Ideas.js");
require("../../models/Usuarios.js");
require("../../models/Actividades.js");


var should = require("chai").should();
var router = require("../../routes/index.js");
var express = require("express");

var app = express();
app.use("/", router);

var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
var request = require("supertest");


describe("router Ideas", function() {
	before(function(done) {
		mockgoose(mongoose).then(function() {
			mongoose.connect("mongodb://localhost/testingRutas");
=======
var express = require('express');
var request = require('supertest');
var should = require("chai").should();
var mongoose = require("mongoose");
var mockgoose = require("mockgoose");

var Idea = require("../../models/Ideas.js");
require("../../models/Usuarios.js");
require("../../models/Actividades.js");
require("blanket")

var app = express();
app.use('/', require('../../routes/index'));



describe("rutas de ideas", function(){

	before(function(done) {
		mockgoose(mongoose).then(function() {
			mongoose.connect("mongodb://localhost/rutasTests");
>>>>>>> Stashed changes
			done();
		})
	});

	afterEach(function(done) {
		mockgoose.reset(done);
	});

<<<<<<< Updated upstream
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
=======
	var idea;

	beforeEach(function(done) {
		idea = new Idea();
		idea.titulo = "Nueva Idea";
  		idea.descripcion = "descripcion de nueva idea";
  		idea.autor =  "Guido";
  		idea.postulante = "postulantePorDefecto";
  		idea.save();

  		idea2 = new Idea();
		idea2.titulo = "Nueva Idea";
  		idea2.descripcion = "descripcion de nueva idea";
  		idea2.autor =  "Guido";
  		idea2.estado = "ELIMINADA";
  		idea2.postulante = "postulantePorDefecto";
  		idea2.save();
>>>>>>> Stashed changes

  		done();
	});

<<<<<<< Updated upstream
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


/*
request(app)
.put("/posts/" + post._id + "/upvote")
.expect(200)
.end(function(err, response) {
should.not.exist(err);
response.body.should.have.property("upvotes").equal(13);
*/
=======
	it("get /ideas debe retornar el total de las ideas no eliminadas", function(done){
		request(app)
			.get("/ideas")
			.expect(200)
			.end(function(err, response){
				should.not.exist(err);
				response.body.should.have.lengthOf(1);
				done();
			});
	});

	//como se arreglaba el tema del Unathrorized? y que onda los pedidos andidados?
	it("post /ideas debe crear una nueva idea con los valores determinados", function(done){
		request(app)
			.post("/ideas")
			.expect(200)
			.end(function(err, response){
				should.not.exist(err);
				request(app)
				.get("/ideas")
				.expect(200)
				.end(function(err,res){
					res.body.should.have.lengthOf(2);
				});
				done();
			});
	});
});

>>>>>>> Stashed changes
