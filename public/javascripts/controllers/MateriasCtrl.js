var app = angular.module('ideasTIP');

app.controller('MateriasCtrl', ['$scope','materiasFactory' ,function($scope,materiasFactory)
{
	$scope.materias = materiasFactory.materias;

	$scope.eliminarMateria = function(materia){
		if(confirm("¿Seguro desea eliminar la materia " + materia.nombre + "?")){
			materiasFactory.eliminar(materia).then(function () {
				$scope.materias = materiasFactory.materias;
			});
		}
	};

	$scope.agregarMateria = function(){
		var materia = {nombre:$scope.nuevaMateria};
		materiasFactory.agregarMateria(materia).then(function () {
			$scope.materias = materiasFactory.materias;
			$scope.nuevaMateria = "";
		});
	};
	
	$scope.modificarMateria = function(materia){
		//TODO
	};
  
}]);