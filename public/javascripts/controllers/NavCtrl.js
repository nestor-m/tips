var app = angular.module('ideasTIP');

app.controller('NavCtrl', ['$scope', 'authFactory', '$uibModal', '$state' ,function($scope, authFactory, $uibModal, $state)
{
  $scope.isLoggedIn = authFactory.isLoggedIn;
  $scope.currentUser = authFactory.currentUser;
  $scope.logOut = authFactory.logOut;

  $scope.verActividades = function(){
    $scope.modalInstance= $uibModal.open({
      templateUrl: 'partials/actividadesModal.html',
      scope: $scope,
      controller: 'actividadesCTRL'
    });
  };

  $scope.verMaterias = function(){
    $state.go('materias');
  };
}]);