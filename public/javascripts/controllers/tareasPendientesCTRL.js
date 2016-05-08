var app = angular.module('ideasTIP');

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