var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Idea = mongoose.model('Idea');
var passport = require('passport');
var Usuario = mongoose.model('Usuario');
var Actividad = mongoose.model('Actividad');
var Comentario = mongoose.model('Comentario');
var Materia = mongoose.model('Materia');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

//req.payload
//{"_id":"5713232b68883aa822f38606","nombre":"alumno","rol":"ALUMNO","exp":1466056545,"iat":1460872545}

//CONSTANTES

//ROLES
const ALUMNO = 'ALUMNO';
const DOCENTE = 'DOCENTE';
const DIRECTOR = 'DIRECTOR';
const ADMINISTRADOR = 'ADMINISTRADOR';
//ESTADOS DE UNA IDEA
const DISPONIBLE = 'DISPONIBLE';
const REVISION = 'REVISION';
const ACEPTADA = 'ACEPTADA';
const ELIMINADA = 'ELIMINADA';
//ACTIVIDADES
const PROPUESTA = 'PROPUESTA';
const COMENTARIO = 'COMENTARIO';
const ACEPTACION = 'ACEPTACION';
const RECHAZO = 'RECHAZO';
const POSTULACION = 'POSTULACION';
const ELIMINACION = 'ELIMINACION';
//ESTADOS DE UNA MATERIA
const ACTIVO = 'ACTIVO';
const INACTIVO = 'INACTIVO';


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

//obtener comentarios de una idea
router.get('/ideas/:idea/comentarios', function(req, res, next) 
{
  req.idea.populate('comentarios', function(err, idea) {
    if (err) { return next(err); }

    res.json(idea.comentarios);
  });
});

//TODO: UQ E SE HAGA EN EL MISMO REQUEST PARA LOS COMENTARIOS
//obtener materias relacionadas a una idea
router.get('/ideas/:idea/materias', function(req, res, next) 
{
  req.idea.populate('materias', function(err, idea) {
    if (err) { return next(err); }

    res.json(idea.materias);
  });
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


router.post('/ideas/:idea/comentar', function(req, res, next){
  var comentario = new Comentario(req.body);
  comentario.idea = req.idea;

  
  var actividad = new Actividad({
    autor : req.body.autor,
    accion: COMENTARIO,
    idea: req.idea
  });
  
  actividad.save();
  comentario.save();
  req.idea.comentarios.push(comentario);
  req.idea.save();

  req.idea.populate('comentarios', function(err, idea) {
    if (err) { return next(err); }

    res.json(idea.comentarios);
  });
});


function callbackIdeaConAccion(actividad, res, next) {
  return function(err, idea){
    if (err) { return next(err); }

    actividad.save();

    res.json(idea);
  }
}

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

      var query = Idea.find({ estado: { $ne: ELIMINADA } });//busco las que tienen estado != ELIMINADA
      query.exec(function(err, ideas){
        if(err){ return next(err); }

        res.json(ideas);
      });
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

  req.idea.postular(req.payload.usuario, callbackIdeaConAccion(actividad, res, next));
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
  if(!req.body.usuario || !req.body.password || !req.body.rol){
    return res.status(400).json({message: 'Por favor llenar todos los campos'});
  }

  var rol = req.body.rol;
  if(rol != ALUMNO && rol != DOCENTE && rol != DIRECTOR && rol != ADMINISTRADOR){
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

//MATERIAS
function findMaterias(res, next)
{
  var query = Materia.find({ estado: ACTIVO });
  query.exec(function(err, materias){
    if(err){ return next(err); }

    res.json(materias);
  });
}
//obtener todas las materias
router.get('/materias', function(req, res, next) 
{
  findMaterias(res,next);
});

router.param('materia', function(req, res, next, id) 
{
  var query = Materia.findById(id);

  query.exec(function (err, materia){
    if (err) { return next(err); }
    if (!materia) { return next(new Error('can\'t find materia')); }

    if(materia.estado == INACTIVO){//no permito el acceso a materias inactivas
      return next(new Error('La materia esta inactiva'));
    }

    req.materia = materia;
    return next();
  });
});


//eliminar materia
router.put('/materias/:materia/eliminar', auth, function(req, res, next) 
{
  if (req.payload.rol != ADMINISTRADOR) { //el unico que tiene acceso a las materias es el administrador
    return next(new Error('El ADMINISTRADOR es el unico que tiene acceso a las materias')); 
  }

  req.materia.eliminar(function(err){
      if (err) { return next(err); }

      findMaterias(res,next);
  });
});

//nueva materia
router.post('/materias', auth, function(req, res, next) 
{
  if (req.payload.rol != ADMINISTRADOR) { 
    return next(new Error('El ADMINISTRADOR es el unico que tiene acceso a las materias')); 
  }

  var materia = new Materia(req.body);

  materia.save(function(err){
      if (err) { return next(err); }

      findMaterias(res,next);
    });
});

//modificar materia
router.put('/materias/:materia/modificar', auth, function(req, res, next) 
{
  if (req.payload.rol != ADMINISTRADOR) { //el unico que tiene acceso a las materias es el administrador
    return next(new Error('El ADMINISTRADOR es el unico que tiene acceso a las materias')); 
  }

console.log('HOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOLA');
  console.log(req.body);

  req.materia.cambiarNombre(req.body.nombre,function(err){
      if (err) { return next(err); }

      findMaterias(res,next);
  });
});

module.exports = router;
