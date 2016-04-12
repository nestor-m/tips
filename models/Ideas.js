var mongoose = require('mongoose');

//ESTADOS DE UNA IDEA
const DISPONIBLE = 'DISPONIBLE';
const REVISION = 'REVISION';
const ACEPTADA = 'ACEPTADA';
const ELIMINADA = 'ELIMINADA';


var IdeaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  autor: String,
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: DISPONIBLE },
  postulante: String
});

/*IdeaSchema.methods.findNoEliminadas = function (cb) {
  return this.model('Idea').find({ estado: { $ne: ELIMINADA } }, cb);
}*/

IdeaSchema.methods.eliminar = function (cb) {
  this.estado = ELIMINADA;
  this.save(cb);
}

IdeaSchema.methods.postular = function (nombreAlumno,cb) {
  this.postulante = nombreAlumno;
  this.estado = REVISION;
  this.save(cb);
}

IdeaSchema.methods.aceptarPostulacion = function (cb) {
  this.estado = ACEPTADA;
  this.save(cb);
}

IdeaSchema.methods.rechazarPostulacion = function (cb) {
  this.estado = DISPONIBLE;
  this.postulante = null;
  this.save(cb);
}

mongoose.model('Idea', IdeaSchema);
