var app = angular.module('ideasTIP');

app.factory('materiasFactory', ['$http', 'authFactory', function($http,authFactory)
{

  var o = {
    materias: []
  };

  o.obtenerMaterias = function() {
    return $http.get('/materias',{headers: {Authorization: 'Bearer '+authFactory.getToken()}}).success(function(data){
      angular.copy(data, o.materias);
    });
  };

  o.eliminar = function(materia){
    return $http.put('/materias/' + materia._id +  '/eliminar' , null, {headers: {Authorization: 'Bearer '+authFactory.getToken()}})
    .success(function(res){
      o.materias = res;
    });
  };

  o.agregarMateria = function(materia) {
    return $http.post('/materias', materia, {headers: {Authorization: 'Bearer '+authFactory.getToken()}})
    .success(function(data){
      o.materias = data;
    });
  };

  return o;
}]);