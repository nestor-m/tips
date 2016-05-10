describe("ideasFactory", function() {	

	beforeEach(module("ideasTIP"));

	var ideasFactory;
	var $httpBackend;

	beforeEach(inject(function($injector) 
	{
	 $httpBackend = $injector.get('$httpBackend');
	 ideasFactory = $injector.get('ideasFactory');

	}));

	it('obtenerIdeas', function(done) {

		var respuesta = [
			{_id:1,titulo:"una idea"},
			{_id:2,titulo:"otra idea"},
			{_id:3,titulo:"y otra idea"}
		];	

		$httpBackend.expectGET('/ideas').respond(respuesta);

		ideasFactory.obtenerIdeas().then(function(){
			ideasFactory.ideas.should.have.lengthOf(3);
			done();
		});

		$httpBackend.flush();
	});

	it('obtenerActividades', function(done) {

		var respuesta = [
			{_id:1,autor:"un autor",accion:"una accion"},
			{_id:2,autor:"un autor",accion:"una accion"},
			{_id:3,autor:"un autor",accion:"una accion"}
		];	

		$httpBackend.expectGET('/actividades').respond(respuesta);

		ideasFactory.obtenerActividades().then(function(res){
			res.data.should.have.lengthOf(3);
			done();
		});

		$httpBackend.flush();
	});

	it('obtenerTareasPendientes', function(done) {

		var respuesta = [
			{_id:1,titulo:"una idea"},
			{_id:2,titulo:"otra idea"},
			{_id:3,titulo:"y otra idea"}
		];	

		$httpBackend.expectGET('/ideas/estado/revision').respond(respuesta);

		ideasFactory.obtenerTareasPendientes().then(function(res){
			res.data.should.have.lengthOf(3);
			done();
		});

		$httpBackend.flush();
	});

	it('crearIdea', function(done) {

		ideasFactory.ideas = [
			{_id:1,titulo:"una idea"},
			{_id:2,titulo:"otra idea"},
			{_id:3,titulo:"y otra idea"}
		];	

		var idea = {_id:4,titulo:"y otra idea mas"};

		$httpBackend.expectPOST('/ideas',idea).respond(idea);

		ideasFactory.crearIdea(idea).then(function(){
			ideasFactory.ideas.should.have.lengthOf(4);//suma una idea
			done();
		});

		$httpBackend.flush();
	});


});