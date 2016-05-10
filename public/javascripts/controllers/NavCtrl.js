var app = angular.module('ideasTIP');

app.controller('NavCtrl', ['$scope', 'authFactory', '$modal', '$state' ,function($scope, authFactory, $modal, $state)
{
  $scope.isLoggedIn = authFactory.isLoggedIn;
  $scope.currentUser = authFactory.currentUser;
  $scope.logOut = authFactory.logOut;

  $scope.verActividades = function(){
    $scope.modalInstance= $modal.open({
      templateUrl: 'partials/actividadesModal.html',
      scope: $scope,
      controller: 'actividadesCTRL'
    });
  };

  $scope.verMaterias = function(){
    $state.go('materias');
  };
}]);