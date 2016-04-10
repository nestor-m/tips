var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Idea = mongoose.model('Idea');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ideas', function(req, res, next) {
  Idea.find(function(err, ideas){
    if(err){ return next(err); }

    res.json(ideas);
  });
});

router.post('/ideas', function(req, res, next) {
  var ideaNueva = new Idea(req.body);
  //post.author = req.payload.username;

  ideaNueva.save(function(err, idea){
    if(err){ return next(err); }

    res.json(idea);
  });
});

module.exports = router;
