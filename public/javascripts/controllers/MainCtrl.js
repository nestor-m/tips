var app = angular.module('ideasTIP');

app.controller('MainCtrl', ['$timeout','$scope','ideasFactory', 'authFactory', '$modal', function($timeout,$scope,ideasFactory,authFactory,$modal)
{ 
  $scope.mostrarMensajePostulacionExitosa = false;

  $scope.ideas = ideasFactory.ideas;
  $scope.usuario = authFactory.currentUser();
  
  
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

  $scope.postularseA = function(idea)
  {
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
      controller: 'detallesCTRL',
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