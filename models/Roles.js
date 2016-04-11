var mongoose = require('mongoose');

var RolSchema = new mongoose.Schema({
  nombre: String
});

mongoose.model('Rol', RolSchema);