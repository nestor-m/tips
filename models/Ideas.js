var mongoose = require('mongoose');

var IdeaSchema = new mongoose.Schema({
	titulo: String,
	detalle: String
});

mongoose.model('Idea', PostSchema);