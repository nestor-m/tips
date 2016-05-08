var app = angular.module('ideasTIP');

app.factory('ideasFactory', ['$http', 'authFactory', function($http,authFactory)
{

  var o = {
    ideas: []
  };

  o.obtenerIdeas = function() {
    return $http.get('/ideas',{headers: {Authorization: 'Bearer '+authFactory.getToken()}}).success(function(data){
      angular.copy(data, o.ideas);
    });
  };

  o.obtenerActividades = function() {
    return $http.get('/actividades',{headers: {Authorization: 'Bearer '+authFactory.getToken()}});
  };

  o.obtenerTareasPendientes = function(){
    return $http.get('/ideas/estado/revision', {headers: {Authorization: 'Bearer '+authFactory.getToken()}});
  }

  o.crearIdea = function(ideaJson) {
    return $http.post('/ideas', ideaJson, {headers: {Authorization: 'Bearer '+authFactory.getToken()}}).success(function(data){
      o.ideas.push(data);
    });
  };

  o.eliminar = function(idea){
    return $http.put('/ideas/' + idea._id +  '/eliminar' , null, {headers: {Authorization: 'Bearer '+authFactory.getToken()}}).success(function(res){
      console.log(res.body);
    });
  };

  o.postularse = function(idea){
    return $http.put('/ideas/'+ idea._id + '/postular', null, {headers: {Authorization: 'Bearer '+authFactory.getToken()}});
  };

  o.aceptarTarea = function(tarea){
    return $http.put('/ideas/' + tarea._id + '/aceptar', null, {headers: {Authorization: 'Bearer '+authFactory.getToken()}}).success(function(res){
      console.log(res.body);
    });
  };

  o.rechazarTarea = function(tarea){
    return $http.put('/ideas/' + tarea._id + '/rechazar', null, {headers: {Authorization: 'Bearer '+authFactory.getToken()}}).success(function(res){
      console.log(res.body);
    });
  };

  return o;
}]);