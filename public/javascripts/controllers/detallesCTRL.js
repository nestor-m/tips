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
    return ideasFactory.comentarIdea($scope.idea,comentario).then(function(){
      $scope.idea.comentarios = ideasFactory.comentariosIdeaSeleccionada;
      $scope.comentario = "";
    });
  };

}]);