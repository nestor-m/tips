var app = angular.module('ideasTIP');

app.controller('detallesCRTL', ['$scope','$state','idea', function($scope, $state, idea){
  $scope.tituloIdea = idea.titulo;
  $scope.descripcionIdea = idea.descripcion;
}])