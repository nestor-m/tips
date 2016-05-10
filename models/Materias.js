var mongoose = require('mongoose');

//ESTADOS DE UNA MATERIA
const ACTIVO = 'ACTIVO';
const INACTIVO = 'INACTIVO';

var MateriaSchema = mongoose.Schema({
	nombre : {type: String, lowercase: true, unique: true},
  	estado: { type: String, default: ACTIVO },
});

MateriaSchema.methods.eliminar = function (cb) {
  this.estado = INACTIVO;
  this.save(cb);
}

mongoose.model("Materia", MateriaSchema);