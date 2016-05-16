var app = angular.module('ideasTIP');

app.factory('materiasFactory', ['$http', 'authFactory', function($http,authFactory)
{

  var o = {
    materias: []
  };

  o.obtenerMaterias = function() {
    return $http.get('/materias',authFactory.getAuthorizationHeader()).success(function(data){
      angular.copy(data, o.materias);
    });
  };

  o.eliminar = function(materia){
    return $http.put('/materias/' + materia._id +  '/eliminar' , null, authFactory.getAuthorizationHeader())
    .success(function(res){
      o.materias = res;
    });
  };

  o.agregarMateria = function(materia) {
    return $http.post('/materias', materia, authFactory.getAuthorizationHeader())
    .success(function(data){
      o.materias = data;
    });
  };

  o.modificarMateria = function(materia) {
    return $http.put('/materias/' + materia._id +  '/modificar', materia, authFactory.getAuthorizationHeader())
    .success(function(data){
      o.materias = data;
    });
  };

  return o;
}]);