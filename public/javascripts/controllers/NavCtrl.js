var app = angular.module('ideasTIP');

app.controller('NavCtrl', ['$scope', 'authFactory', function($scope, authFactory)
{
  $scope.isLoggedIn = authFactory.isLoggedIn;
  $scope.currentUser = authFactory.currentUser;
  $scope.logOut = authFactory.logOut;
}]);