var app = angular.module('ideasTIP');

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
}]);