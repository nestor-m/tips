var mongoose = require('mongoose');

var ComentariosSchema = mongoose.Schema({
	autor : String,
	idea : { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
	fecha: { type: Date, default: Date.now },
	contenido : String
});

mongoose.model("Comentario", ComentariosSchema);