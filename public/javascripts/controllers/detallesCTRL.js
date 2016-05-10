var app = angular.module('ideasTIP');

app.controller('detallesCTRL', ['$scope','$http','idea','authFactory', 'ideasFactory',
	function($scope,$http, idea, authFactory, ideasFactory)
	{

  $scope.idea = idea;

  ideasFactory.obtenerComentariosDeIdea(idea).then(function(){
    $scope.idea.comentarios = ideasFactory.comentariosIdeaSeleccionada;
  });

  ideasFactory.obtenerMateriasRelacionadasAIdea(idea).then(function(){
    $scope.idea.materiasRelacionadas = ideasFactory.materiasRelacionadasAIdeaSeleccionada;
  });

  $scope.comentar = function(){
  	var comentario = {
  		autor: $scope.usuario.usuario,  		
  		contenido: $scope.comentario
  	};
    console.log($scope.comentario);
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