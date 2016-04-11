var mongoose = require('mongoose');

//ESTADOS DE UNA IDEA
const DISPONIBLE = 'DISPONIBLE';
const REVISION = 'REVISION';
const ACEPTADA = 'ACEPTADA';
const ELIMINADA = 'ELIMINADA';


var IdeaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: DISPONIBLE }
});

/*IdeaSchema.methods.findNoEliminadas = function (cb) {
  return this.model('Idea').find({ estado: { $ne: ELIMINADA } }, cb);
}*/

IdeaSchema.methods.eliminar = function (cb) {
  this.estado = ELIMINADA;
  this.save(cb);
}

mongoose.model('Idea', IdeaSchema);
