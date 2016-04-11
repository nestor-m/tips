var mongoose = require('mongoose');

const DISPONIBLE = 'DISPONIBLE';
const REVISION = 'REVISION';
const ACEPTADA = 'ACEPTADA';
const ELIMINADA = 'ELIMINADA';

var IdeaEstadoSchema = new mongoose.Schema({
  nombre: { type: String, default: DISPONIBLE }
});

mongoose.model('IdeaEstado', IdeaEstadoSchema);