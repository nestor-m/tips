var app = angular.module('ideasTIP');

app.controller('actividadesCTRL', ['$scope','$state','ideasFactory', function($scope, $state, ideasFactory){

  ideasFactory.obtenerActividades().then(function(activ) {
    $scope.actividades = activ.data;
  });


  $scope.cerrar=function(){
    $scope.modalInstance.close();
  };
}])