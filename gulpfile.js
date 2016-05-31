var gulp = require('gulp');
var inject = require("gulp-inject");
var gulpSequence = require("gulp-sequence");
var Server = require('karma').Server;
var mocha = require('gulp-mocha');
var protractor = require("gulp-protractor").protractor;
var mainBowerFiles = require("gulp-main-bower-files");

gulp.task('default', function () { console.log('Hello Gulp!') });

function injectDep(tag, elements){

	return gulp.src("views/index.ejs").pipe(inject(elements, {
		starttag: '<!-- inject:' + tag + ' -->',
    	endtag: '<!-- endinject -->',
		ignorePath: "public",
		addRootSlash : true
	})).pipe(gulp.dest("views"))
}

gulp.task('addFactoriesDep', function(){
	var elements = gulp.src("public/javascripts/factories/**/*.js");
	return injectDep("factories", elements);
});

gulp.task('addControllersDep', function(){
	var elements = gulp.src("public/javascripts/controllers/**/*.js");
	return injectDep("controllers", elements);
});

gulp.task('addInternalDep', function(){
	var elements = gulp.src("bower.json").pipe(mainBowerFiles())
	return injectDep("internal", elements);
});

gulp.task("addAllDep", gulpSequence("addFactoriesDep", "addControllersDep", "addInternalDep"));



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
				    args: ['--baseUrl', 'http://127.0.0.1:8000']
				}))
				.on('error', function(e) { throw e })
});

gulp.task("test", ["mocha", "karma", "protractor"]);