var mongoose = require('mongoose');

var ActividadSchema = new mongoose.Schema({
  autor: String,
  accion: String,
  idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
  fecha: { type: Date, default: Date.now }
});


mongoose.model('Actividad', ActividadSchema);