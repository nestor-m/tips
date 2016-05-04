var app = angular.module('ideasTIP', ['ui.bootstrap','ui.router','angularMoment']);

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) 
{
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        ideas:  ['ideasFactory', function(ideasFactory){
          return ideasFactory.obtenerIdeas();
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/partials/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'authFactory', function($state, authFactory){
        if(authFactory.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: '/partials/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'authFactory', function($state, authFactory){
        if(authFactory.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

    $urlRouterProvider.otherwise('login');
}]);


app.factory('ideasFactory', ['$http', 'authFactory', function($http,authFactory)
{

  var o = {
    ideas: [
 //     {title: 'post 1', upvotes: 5},    
 //     {title: 'post 2', upvotes: 2},
 //     {title: 'post 3', upvotes: 15},
 //     {title: 'post 4', upvotes: 9},
 //     {title: 'post 5', upvotes: 4}
    ]
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

app.controller('MainCtrl', ['$timeout','$scope','ideasFactory', 'authFactory', '$modal', function($timeout,$scope,ideasFactory,authFactory,$modal)
{ 
  //$scope.isLoggedIn = auth.isLoggedIn;

  $scope.mostrarMensajePostulacionExitosa = false;

  $scope.ideas = ideasFactory.ideas;
  $scope.usuario = authFactory.currentUser();
  
//   $scope.posts = [
//     {title: 'post 1', upvotes: 5},    
//     {title: 'post 2', upvotes: 2},
//     {title: 'post 3', upvotes: 15},
//     {title: 'post 4', upvotes: 9},
//     {title: 'post 5', upvotes: 4}
//   ];
  
  $scope.agregarIdea = function(){
    if(!$scope.titulo || $scope.titulo === '') { return; }
    ideasFactory.crearIdea({
      titulo: $scope.titulo,
      descripcion: $scope.descripcion
    });
    $scope.titulo = '';
    $scope.descripcion = '';
  };


  $scope.eliminarIdea = function(idea){
    ideasFactory.eliminar(idea).then(function () {
      location.reload();
    });
  };

  $scope.postularseA = function(idea){
     //$scope.estadoPostulacion = ideasFactory.postularse(idea);
     //console.log($scope.estadoPostulacion); 
     $scope.ideaALaQueSePostula = idea;
     ideasFactory.postularse(idea).then(function(response){
      $scope.mostrarMensajePostulacionExitosa = true;
      $timeout(function(){$scope.mostrarMensajePostulacionExitosa = false;} , 3000);
     }, function(response) {
      //TODO: hacer algo cuando hay error
    });
  };

  $scope.abrirDetalles = function(idea){
    console.log('titulo: ', idea.titulo);
    console.log('descripcion: ', idea.descripcion);
    $scope.modalInstance= $modal.open({
      templateUrl: 'partials/detallesModal.html',
      scope: $scope,
      controller: 'detallesCRTL',
      resolve: {
        idea: function () {
          return idea;
        }
      }
    });
  };

  $scope.verActividades = function(){
    $scope.modalInstance= $modal.open({
      templateUrl: 'partials/actividadesModal.html',
      scope: $scope,
      controller: 'actividadesCTRL'
    });
  };

  $scope.verTareasPendientes = function(){
    $scope.modalInstance= $modal.open({
      templateUrl: 'partials/tareasPendientesModal.html',
      scope: $scope,
      controller: 'tareasPendientesCTRL'
    });
  };

  $scope.cerrar=function(){
    $scope.modalInstance.close();
  };

}]);

app.controller('detallesCRTL', ['$scope','$state','idea', function($scope, $state, idea){
  $scope.tituloIdea = idea.titulo;
  $scope.descripcionIdea = idea.descripcion;
}])

app.controller('tareasPendientesCTRL', ['$scope','ideasFactory', function($scope, ideasFactory, idea){
  ideasFactory.obtenerTareasPendientes().then(function(tareas) {
    $scope.tareasPendientes = tareas.data;
  });

  $scope.aceptarTarea = function(tarea){
    ideasFactory.aceptarTarea(tarea);
    $scope.modalInstance.close();
    $scope.cerrar();
  };

  $scope.rechazarTarea = function(tarea){
    ideasFactory.rechazarTarea(tarea);
    $scope.cerrar();
  };

  $scope.cerrar=function(){
    $scope.modalInstance.close();
  };
}])

app.controller('actividadesCTRL', ['$scope','$state','ideasFactory', function($scope, $state, ideasFactory){

  ideasFactory.obtenerActividades().then(function(activ) {
    $scope.actividades = activ.data;
  });


  $scope.cerrar=function(){
    $scope.modalInstance.close();
  };
}])


app.controller('AuthCtrl', ['$scope','$state','authFactory', function($scope, $state, authFactory){
  $scope.usuario = {};

  $scope.rolesPosibles = ["DIRECTOR", "DOCENTE", "ALUMNO"];

  $scope.registrarUsuario = function(){
    authFactory.register($scope.usuario).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    authFactory.logIn($scope.usuario).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}])


app.controller('NavCtrl', ['$scope', 'authFactory', function($scope, authFactory)
{
  $scope.isLoggedIn = authFactory.isLoggedIn;
  $scope.currentUser = authFactory.currentUser;
  $scope.logOut = authFactory.logOut;
}]);