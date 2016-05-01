var chai = require('chai');
var expect = require('chai').expect;
var should = require("chai").should();
var mongoose = require("mongoose");
var mockgoose = require("mockgoose");
var Idea = require("../../models/Ideas.js");

describe('propiedad Idea del modelo', function(){

	before(function(done){
		mockgoose(mongoose).then(function(){
			mongoose.connect("mongodb://localhost/testingIdeas");
			done();
		})
	});

	afterEach(function(done) {
		mockgoose.reset(done);
	})

	var idea;

	beforeEach(function(done){
		idea = new Idea();
		idea.titulo = "Nueva Idea";
  		idea.descripcion = "descripcion de nueva idea";
  		idea.autor =  "Guido";
  		idea.postulante = "postulantePorDefecto";
  		idea.save(done);
	});

	describe('el metodo postularse a una idea', function(){
		it('setea el estado de una idea a REVISION', function(done){
			idea.postular("alumno1",function(err, ideaPostulada){
				expect(ideaPostulada).to.have.property("estado").equal("REVISION");
				done();
			});
		});

		it('setea el nombre del postulante de una idea', function(done){
			idea.postular("alumno1",function(err, ideaPostulada){
				expect(ideaPostulada).to.have.property("postulante").equal("alumno1");
				done();
			});
		});
	});
	describe('el metodo eliminar de una idea', function(){
		it('setea el estado de una idea a ELIMINADA', function(done){
			idea.eliminar(function(err, ideaEliminada){
				expect(ideaEliminada).to.have.property("estado").equal("ELIMINADA");
				done();
			});
		});
	});
	describe('el metodo aceptar postulacion de una idea', function(){
		it('setea el estado de una idea a ACEPTADA', function(done){
			idea.aceptarPostulacion(function(err, ideaAceptada){
				expect(ideaAceptada).to.have.property("estado").equal("ACEPTADA");
				done();
			});
		});
	});

	describe('el metodo rechazar postulacion a una idea', function(){
		it('setea el estado de una idea a DISPONIBLE', function(done){
			idea.rechazarPostulacion(function(err, ideaRechazada){
				expect(ideaRechazada).to.have.property("estado").equal("DISPONIBLE");
				done();
			});
		});

		it('setea NULL al nombre del postulante de la idea', function(done){
			idea.rechazarPostulacion(function(err, ideaPostulada){
				ideaPostulada.should.have.property("postulante").to.be.null;
				done();
			});
		});
	});
});