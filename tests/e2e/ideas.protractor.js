var should = require("chai").should();

var expect = require("chai").expect();

var protractor = require("protractor");


describe("pagina para loguearse", function() {
    it ("debe loguearse correctamente", function(done) {
        browser.get("http://localhost:3000");
        element(by.linkText("Log In")).click();

        element(by.model("usuario.usuario")).sendKeys("docente");
        element(by.model("usuario.password")).sendKeys("docente");
        element(by.buttonText("LogIn")).click();

         element(by.binding("currentUser().usuario")).getText().then(function(value) {
            value.should.be.equal("docente");
            done();
        })
    });

    it ("debe haber error al loguearse incorrectamente", function(done) {
        browser.get("http://localhost:3000");
        element(by.linkText("Log Out")).click();

        element(by.model("usuario.usuario")).sendKeys("docenteInc");
        element(by.model("usuario.password")).sendKeys("docenteInc");
        element(by.buttonText("LogIn")).click();

         element(by.binding("error.message")).getText().then(function(value) {
            value.should.be.equal("Incorrect username.");
            done();
        })
    });
});


context("ya estando logueado", function(){
    before(function(done){
        browser.get("http://localhost:3000");
        element(by.linkText("Log In")).click();

        element(by.model("usuario.usuario")).sendKeys("docente");
        element(by.model("usuario.password")).sendKeys("docente");
        element(by.buttonText("LogIn")).click();
        done();
    });

    describe("agregar titulo y detalle de idea", function() {
    
        it ("debe crear una idea correctamente", function(done) {
            element(by.model("titulo")).sendKeys("titulo de nueva IDEA");
            element(by.model("descripcion")).sendKeys("el detalle de una nueva idea");
            element(by.buttonText("Crear")).click();

            //by.repeater('calc in calculations')).count()
            element.all(by.repeater('idea in ideas')).count().then(function(cantIdeas) {
                cantIdeas.should.be.equal(1);
                done();
            });
        });
    });

    /*
    describe("dentro de los detalles de una idea", function() {
        before(function(done){
            element(by.model('ideas')).element(by.linkText('Detalles')).click();
            done();
        });


        it("lleno el input y genero un comentario", function(done){
            element(by.model("comentario")).sendKeys("un nuevo comentario");
        });
    });
    */
});
