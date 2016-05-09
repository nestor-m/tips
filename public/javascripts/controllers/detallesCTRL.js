var app = angular.module('ideasTIP');

app.controller('detallesCTRL', ['$scope','$http','idea','authFactory',
	function($scope,$http, idea, authFactory)
	{
  $scope.idea = idea;

  // $scope.idea.comentarios = [
	 //  {"autor":"pepe","contenido":"Me parece una muy buena idea","fecha":new Date()},
	 //  {"autor":"pepe","contenido":"Me parece una muy buena idea","fecha":new Date()},
	 //  {"autor":"pepe","contenido":"Me parece una muy buena idea","fecha":new Date()},
	 //  {"autor":"pepe","contenido":"Me parece una muy buena idea","fecha":new Date()}
  // ];

  $scope.comentar = function(){
  	var comentario = {
  		autor: $scope.usuario.usuario,  		
  		contenido: $scope.comentario
  	};
  	return $http.post('/ideas/'+ $scope.idea._id + '/comentar',
  		comentario,
  		{
  			headers: { Authorization: 'Bearer ' + authFactory.getToken() }
  		}
  	).success(function(data){//espero que me retorne la lista de todos los comentarios
  		$scope.idea.comentarios = data;
  	},function(error){
  		alert("No se pudo realizar el comentario \n" + error);
  	});
  };

}]);