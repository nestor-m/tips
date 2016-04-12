var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Idea = mongoose.model('Idea');

var passport = require('passport');
var Usuario = mongoose.model('Usuario');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', { title: 'Express' });
});


//IDEAS

//ESTADOS DE UNA IDEA
const DISPONIBLE = 'DISPONIBLE';
const REVISION = 'REVISION';
const ACEPTADA = 'ACEPTADA';
const ELIMINADA = 'ELIMINADA';

//ideas no eliminadas
router.get('/ideasNoEliminadas', function(req, res, next) 
{
  var query = Idea.find({ estado: { $ne: ELIMINADA } });//busco las que tienen estado != ELIMINADA
  query.exec(function(err, ideas){
    if(err){ return next(err); }

    res.json(ideas);
  });
});

router.param('idea', function(req, res, next, id) 
{
  var query = Idea.findById(id);

  query.exec(function (err, idea){
    if (err) { return next(err); }
    if (!idea) { return next(new Error('can\'t find idea')); }

    req.idea = idea;
    return next();
  });
});


router.get('/ideas/:idea', function(req, res, next) 
{
  res.json(req.idea);
});

//proponer nueva idea //TODO: solo docentes pueden proponer ideas
router.post('/ideas', function(req, res, next) 
{
  var idea = new Idea(req.body);

  idea.save(function(err, post){
    if(err){ return next(err); }

    res.json(idea);
  });
});

//eliminar idea //TODO: solo puede eliminar una idea el autor o el director de la carrera
router.put('/ideas/:idea/eliminar', function(req, res, next) 
{
  req.idea.eliminar(function(err, idea){
    if (err) { return next(err); }

    res.json(idea);
  });
});

//postularse para una idea. //TODO: solo alumnos
router.put('/ideas/:idea/postular', function(req, res, next) 
{
  req.idea.postular(req.body.nombre,function(err, idea){
    if (err) { return next(err); }

    res.json(idea);
  });
});

//ideas en revision TODO: solo director
router.get('/ideasEnRevision', function(req, res, next) 
{
  var query = Idea.find({ estado: REVISION });//busco las que tienen estado = REVISION
  query.exec(function(err, ideas){
    if(err){ return next(err); }

    res.json(ideas);
  });
});

//aceptar postulacion TODO: solo director
router.put('/ideas/:idea/aceptarPostulacion', function(req, res, next) 
{
  req.idea.aceptarPostulacion(function(err, idea){
    if (err) { return next(err); }

    res.json(idea);
  });
});

//rechazar postulacion TODO: solo director
router.put('/ideas/:idea/rechazarPostulacion', function(req, res, next) 
{
  req.idea.rechazarPostulacion(function(err, idea){
    if (err) { return next(err); }

    res.json(idea);
  });
});


//USUARIOS
const ALUMNO = 'ALUMNO';
const DOCENTE = 'DOCENTE';
const DIRECTOR = 'DIRECTOR';

router.post('/usuarios', function(req, res, next)
{
  if(!req.body.nombre || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var rol = req.body.rol;
  if(rol != ALUMNO && rol != DOCENTE && rol != DIRECTOR){
    return res.status(500).json({message: 'Rol invalido'});
  }

  var usuario = new Usuario();

  usuario.nombre = req.body.nombre;
  usuario.rol = rol;
  usuario.setPassword(req.body.password)

  usuario.save(function (err){
    if(err){ return next(err); }

    return res.json({token: usuario.generateJWT()})
  });
});

//LOGIN
router.post('/login', function(req, res, next)
{
  if(!req.body.nombre || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, usuario, info){
    if(err){ return next(err); }

    if(usuario){
      return res.json({token: usuario.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


module.exports = router;
