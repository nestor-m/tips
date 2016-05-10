describe("detallesCTRL", function() {	

	beforeEach(module("ideasTIP"));

	var rootScope;
	var $httpBackend;
	var createController;

	beforeEach(inject(function($injector) 
	{
	 $httpBackend = $injector.get('$httpBackend');
	 $rootScope = $injector.get('$rootScope');
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

	it('Cuando abro el detalle de una idea se debe hacer un GET para traer los comentarios y otro GET para las materias relacionadas', function() {
		var controller = createController();

		var respuesta = [
			{_id:1,contenido:"un comentario"},
			{_id:2,contenido:"otro comentario"},
			{_id:3,contenido:"hola, vengo a comentar una idea"}
		];	

		$httpBackend.expectGET('/ideas/1234/comentarios').respond(respuesta);
		$httpBackend.expectGET('/ideas/1234/materias').respond(respuesta);

		$httpBackend.flush();
	});


	it('para hacer un comentario deberia hacer un POST', function(done) {
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

		$httpBackend.expectGET('/ideas/1234/comentarios').respond(respuesta);
		$httpBackend.expectGET('/ideas/1234/materias').respond(respuesta);		
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

});