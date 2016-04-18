var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

passport.use(new LocalStrategy(
  function(nombre, password, done) {
    Usuario.findOne({ nombre: nombre }, function (err, usuario) {
      if (err) { return done(err); }
      if (!usuario) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!usuario.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, usuario);
    });
  }
));