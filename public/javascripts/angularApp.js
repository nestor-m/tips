var app = angular.module('ideasTIP', ['ui.router','angularMoment']);

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) 
{
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      //resolve: {
      //  ideas:  ['ideas', function(ideas){
      //    return ideas.obtenerIdeas();
       //}]
     //}
    })

  $urlRouterProvider.otherwise('home');
}]);

app.factory('ideasFactory', ['$http', 'auth', function($http,auth)
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
    return $http.get('/ideas').success(function(data){
      angular.copy(data, o.ideas);
    });
  };

  o.crearIdea = function(ideaJson) {
    return $http.post('/ideas', ideaJson).success(function(data){
      o.ideas.push(data);
    });
  };

  return o;
}]);

app.controller('MainCtrl', ['$scope','ideasFactory', 'auth', function($scope,ideasFactory,auth)
{ 
  //$scope.isLoggedIn = auth.isLoggedIn;

  $scope.ideas = ideasFactory.ideas;
  
  
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
    });
    $scope.title = '';
  };
}]);














app.controller('PostsCtrl', ['$scope', 'posts', 'post', 'auth',function($scope, posts, post, auth)
{
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.post = post;
  
  $scope.addComment = function(){
    if($scope.body === '') { return; }
    posts.addComment(post._id, {
      body: $scope.body,
      author: 'user',
    }).success(function(comment) {
      $scope.post.comments.push(comment);
    });
    $scope.body = '';
  };

  $scope.incrementUpvotes = function(comment){
    posts.upvoteComment(post, comment);
  };
  
}]);


//Authentication
app.factory('auth', ['$http', '$window', function($http, $window){  
  var auth = {};

  auth.saveToken = function (token){
    $window.localStorage['flapper-news-token'] = token;
  };

  auth.getToken = function (){
    return $window.localStorage['flapper-news-token'];
  }

  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('flapper-news-token');
  };

  return auth;
}]);

//authentication controller
app.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth)
{
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);


app.controller('NavCtrl', ['$scope', 'auth', function($scope, auth)
{
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

