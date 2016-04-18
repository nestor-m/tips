var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Idea = mongoose.model('Idea');

var passport = require('passport');
var Usuario = mongoose.model('Usuario');

var Actividad = mongoose.model('Actividad');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

//req.payload
//{"_id":"5713232b68883aa822f38606","nombre":"alumno","rol":"ALUMNO","exp":1466056545,"iat":1460872545}

//CONSTANTES

//ROLES
const ALUMNO = 'ALUMNO';
const DOCENTE = 'DOCENTE';
const DIRECTOR = 'DIRECTOR';
//ESTADOS DE UNA IDEA
const DISPONIBLE = 'DISPONIBLE';
const REVISION = 'REVISION';
const ACEPTADA = 'ACEPTADA';
const ELIMINADA = 'ELIMINADA';
//ACTIVIDADES
const PROPUESTA = 'PROPUESTA';
const ACEPTACION = 'ACEPTACION';
const RECHAZO = 'RECHAZO';
const POSTULACION = 'POSTULACION';
const ELIMINACION = 'ELIMINACION';

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', { title: 'Express' });
});


//IDEAS
//ideas no eliminadas
router.get('/ideas', function(req, res, next) 
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

    if(idea.estado == ELIMINADA){//no permito el acceso a ideas eliminadas
      return next(new Error('La idea esta eliminada'));
    }

    req.idea = idea;
    return next();
  });
});

//obtener una idea
router.get('/ideas/:idea', function(req, res, next) 
{
  res.json(req.idea);
});

//proponer nueva idea, solo docentes
//ej JSON: {"titulo":"Una idea","descripcion":"Una idea de TIP"}
router.post('/ideas', auth, function(req, res, next) 
{
  if (req.payload.rol != DOCENTE) { 
    return next(new Error('Solo docentes pueden proponer ideas de TIP')); 
  }

  var idea = new Idea(req.body);
  idea.autor = req.payload.usuario;

  var actividad = new Actividad({
    autor: req.payload.usuario,
    accion: PROPUESTA
  });

  idea.save(function(err, idea){
    if(err){ return next(err); }

    actividad.idea = idea;
    actividad.save();

    res.json(idea);
  });
});

//eliminar idea. Solo puede eliminar una idea el autor o el director de la carrera
router.put('/ideas/:idea/eliminar', auth, function(req, res, next) 
{
  if (req.payload.usuario != req.idea.autor && req.payload.rol != DIRECTOR) { 
    return next(new Error('Una idea de TIP solo puede ser elimina por el autor o el director de la carrera.')); 
  }

  var actividad = new Actividad({
    autor: req.payload.usuario,
    accion: ELIMINACION,
    idea: req.idea
  });

  req.idea.eliminar(function(err, idea){
    if (err) { return next(err); }

    actividad.save();

    res.json(idea);
  });
});

//postularse para una idea. Solo alumnos
router.put('/ideas/:idea/postular', auth, function(req, res, next) 
{
  if (req.payload.rol != ALUMNO) { 
    return next(new Error('Solo alumnos pueden postularse a ideas de TIP')); 
  }

  var actividad = new Actividad({
    autor: req.payload.usuario,
    accion: POSTULACION,
    idea: req.idea
  });

  req.idea.postular(req.payload.usuario,function(err, idea){
    if (err) { return next(err); }

    actividad.save();

    res.json(idea);
  });
});

//ver loggeo de actividades
router.get('/actividades', function(req, res, next) 
{
  var query = Actividad.find().populate('idea');
  query.exec(function(err, actividades){
    if(err){ return next(err); }

    res.json(actividades);
  });
});

//ver ideas en revision. Solo director
router.get('/ideas/estado/revision', auth, function(req, res, next) 
{
  if (req.payload.rol != DIRECTOR) { 
    return next(new Error('Solo el director de la carrera puede ver las ideas de TIP en revision.')); 
  }

  var query = Idea.find({ estado: REVISION });//busco las que tienen estado = REVISION
  query.exec(function(err, ideas){
    if(err){ return next(err); }

    res.json(ideas);
  });
});

//aceptar postulacion. Solo director
router.put('/ideas/:idea/aceptar', auth, function(req, res, next) 
{
  if (req.payload.rol != DIRECTOR) { 
    return next(new Error('Solo el director de la carrera puede aceptar postulaciones a ideas de TIP.')); 
  }

  var actividad = new Actividad({
    autor: req.payload.usuario,
    accion: ACEPTACION,
    idea: req.idea
  });

  req.idea.aceptarPostulacion(function(err, idea){
    if (err) { return next(err); }

    actividad.save();

    res.json(idea);
  });
});

//rechazar postulacion. Solo director
router.put('/ideas/:idea/rechazar', auth, function(req, res, next) 
{
  if (req.payload.rol != DIRECTOR) { 
    return next(new Error('Solo el director de la carrera puede rechazar postulaciones a ideas de TIP.')); 
  }

  var actividad = new Actividad({
    autor: req.payload.usuario,
    accion: RECHAZO,
    idea: req.idea
  });

  req.idea.rechazarPostulacion(function(err, idea){
    if (err) { return next(err); }

    actividad.save();

    res.json(idea);
  });
});


//REGISTRO de nuevos usuarios
//ejemplo JSON: {"usuario":"director","password":"director","rol":"DIRECTOR"}
router.post('/registro', function(req, res, next){
  if(!req.body.usuario || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var rol = req.body.rol;
  if(rol != ALUMNO && rol != DOCENTE && rol != DIRECTOR){
    return res.status(500).json({message: 'Rol invalido'});
  }

  var usuario = new Usuario();

  usuario.nombre = req.body.usuario;
  usuario.rol = req.body.rol;
  usuario.setPassword(req.body.password)

  usuario.save(function (err){
    if(err){ return next(err); }

    return res.json({token: usuario.generateJWT()})
  });
});

//LOGIN
//ejmplo JSON: {"usuario":"docente","password":"docente"}
router.post('/login', function(req, res, next){
  if(!req.body.usuario || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  req.body.username = req.body.usuario;//parece que passport.authenticate usa req.body.username porque se lo cambie y rompia

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
