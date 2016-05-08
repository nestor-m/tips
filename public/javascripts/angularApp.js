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