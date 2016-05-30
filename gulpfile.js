var gulp = require('gulp');
var inject = require("gulp-inject");
var gulpSequence = require("gulp-sequence");
var Server = require('karma').Server;
var mocha = require('gulp-mocha');
var protractor = require("gulp-protractor").protractor;
var jshint = require('gulp-jshint');

function injectDep(pathToDep, tag){
	var elements = gulp.src(pathToDep);

	return gulp.src("views/index.ejs").pipe(inject(elements, {
		starttag: '<!-- inject:' + tag + ' -->',
    	endtag: '<!-- endinject -->',
		ignorePath: "public",
		addRootSlash : true
	})).pipe(gulp.dest("views"));
}

gulp.task('addFactoriesDep', function(){
	return injectDep("public/javascripts/factories/**/*.js", "factories");	
});

gulp.task('addControllersDep', function(){
	return injectDep("public/javascripts/controllers/**/*.js", "controllers");	
});

gulp.task("addAllDep", gulpSequence("addFactoriesDep", "addControllersDep"));


//TESTS
gulp.task('mocha', function() {
    return gulp.src('tests/backend/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

//Si rompe y dice que no encuentra chrome-driver ejecutar
//$node_modules/gulp-protractor/node_modules/protractor/bin/webdriver-manager update
gulp.task('protractor',function(){
	return gulp.src(["tests/e2e/*.js"])
				.pipe(protractor({
				    configFile: "protractor.conf.js",
				    args: ['--baseUrl', 'http://127.0.0.1:3000']
				}))
				.on('error', function(e) { throw e; });
});

gulp.task("test", ["mocha", "karma", "protractor"]);

//CHEQUEAR CODIGO
gulp.task('lint', function() {
  return gulp.src([
  					'gulpfile.js',
  					'app.js',
  					'tests/**/*.js',
  					'routes/*.js',
  					'public/**/*.js',
  					'!public/javascripts/*moment.js',//excluyo angular-moment.js y moment.js
  					'models/*.js'
  				])
    .pipe(jshint({
    				esversion : 6, //reglas: esversion:6 para usar const
    				asi : true // suprime los warnings por falta de ";"
    			})
    	)
    .pipe(jshint.reporter('jshint-stylish'));
});

//esto corre Travis definido en .travis.yml
gulp.task("default", ["lint","protractor"]);