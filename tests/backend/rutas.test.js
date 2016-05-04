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