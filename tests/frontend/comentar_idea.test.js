describe("comentar una idea de TIP", function() {	

	beforeEach(module("ideasTIP"));

	var rootScope;
	var $httpBackend;
	var createController;

	beforeEach(inject(function($injector) {
	 // Set up the mock http service responses
	 $httpBackend = $injector.get('$httpBackend');

	 // Get hold of a scope (i.e. the root scope)
	 $rootScope = $injector.get('$rootScope');
	 // The $controller service is used to create instances of controllers
	 var $controller = $injector.get('$controller');

	 createController = function() {
	   return $controller('detallesCTRL', {
	   	'$scope' : $rootScope,
	   	"idea": {
			_id: 1234,
			comentarios: [
				{_id:1,contenido:"un comentario"},{_id:2,contenido:"otro comentario"}
			]
		}
	   });
	 };
	}));

	it('deberia hacer un POST', function(done) {
		var controller = createController();

		var respuesta = [
			{_id:1,contenido:"un comentario"},
			{_id:2,contenido:"otro comentario"},
			{_id:3,contenido:"hola, vengo a comentar una idea"}
		];		

		var comentario = {
			autor: "nestor",
			contenido: "hola, vengo a comentar una idea"
		};

		$httpBackend.expectPOST('/ideas/1234/comentar', comentario).respond(respuesta);

		var usuario = {
			usuario: "nestor"
		};
		$rootScope.usuario = usuario;
		$rootScope.comentario = "hola, vengo a comentar una idea";
		var promise = $rootScope.comentar();
		promise.then(function() {			
			$rootScope.idea.comentarios.should.have.lengthOf(3);
			done();
		});
		$httpBackend.flush();
	});



	// beforeEach(inject(function(_$httpBackend_,$rootScope,$controller,_authFactory_) 
	// {		
	// 	scope = $rootScope.$new();
 //        detallesCTRL = $controller('detallesCTRL', {
 //        	"$scope": scope,
 //        	"idea": {
 //        		_id: 1234,
 //        		comentarios: [
 //        			{_id:1,contenido:"un comentario"},{_id:2,contenido:"otro comentario"}
 //        		]
 //        	},
 //        	"authFactory": _authFactory_
 //        });
 //        $httpBackend = _$httpBackend_;
	// }));
	

	// describe("comentar", function()
	// {
	// 	it("debe hacer un POST al backend", function(done)
	// 	{
	// 		var usuario = {
	// 			usuario: "nestor"
	// 		};
	// 		scope.usuario = usuario;
	// 		scope.comentario = "hola, vengo a comentar una idea";

 //        	var comentario = {
 //        		autor: "nestor",
 //        		contenido: "hola, vengo a comentar una idea"
 //        	};

	// 		var respuesta = [
 //        			{_id:1,contenido:"un comentario"},
 //        			{_id:2,contenido:"otro comentario"},
 //        			{_id:3,contenido:"hola, vengo a comentar una idea"}
 //        	];

	// 		$httpBackend.expectPOST("/ideas/1234/comentar",comentario).respond(respuesta);

	// 		var promise = scope.comentar();
	// 		promise.then(function() {
	// 			scope.idea.comentarios.should.have.lengthOf(3);
	// 			done();
	// 		});


	// 		$httpBackend.flush();
	// 	});

	// });

});