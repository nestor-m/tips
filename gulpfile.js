var gulp = require('gulp');
var inject = require("gulp-inject");
var gulpSequence = require("gulp-sequence");
var Server = require('karma').Server;
var mocha = require('gulp-mocha');
var protractor = require("gulp-protractor").protractor;
var jshint = require('gulp-jshint');
var expressServer = require('gulp-express');
var mainBowerFiles = require('gulp-main-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concatCss = require('gulp-concat-css');
var minimist = require('minimist')
var conventionalChangelog = require('gulp-conventional-changelog')

//////////////////////////////RELEASES///////////

var options = minimist(process.argv.slice(2));

var bump = require('gulp-bump')

gulp.task('bump-version', function() {
   if (!options.type && !options.version)
      throw new Error('You must provide either a --type major/minor/patch or --version x.x.x option')
   return gulp.src('package.json')
      .pipe(bump(options).on('error', gutil.log))
      .pipe(gulp.dest('./'))
})

var commitConvention = "angular";

gulp.task('changelog', function() {
  return gulp.src('CHANGELOG.md', { buffer: false })
    .pipe(conventionalChangelog({ preset: commitConvention }))
    .pipe(gulp.dest('./'))
})

//////////////////////////////////////////////

function injectDep(tag, elements){

  return gulp.src("views/index.ejs").pipe(inject(elements, {
    starttag: '<!-- inject:' + tag + ' -->',
      endtag: '<!-- endinject -->',
    ignorePath: "public",
    addRootSlash : true
  })).pipe(gulp.dest("views"));
}

gulp.task('addFactoriesDep', function(){
  var elements = gulp.src("public/javascripts/factories/**/*.js");
  return injectDep("factories", elements);
});

gulp.task('addControllersDep', function(){
  var elements = gulp.src("public/javascripts/controllers/**/*.js");
  return injectDep("controllers", elements);
});

gulp.task('minifyAndUglifyDepJS', function(){
  return gulp.src("bower.json")
  .pipe(mainBowerFiles("**/*.js"))
  .pipe(concat('allDepJS.js'))
  .pipe(uglify().on('error', function(e){ console.log(e); }))
  .pipe(gulp.dest("public/dependencies"));
});

gulp.task('minifyAndUglifyDepCSS', function(){
  return gulp.src("bower_components/**/*.css")
  //.pipe(mainBowerFiles("**/*.css"))
  .pipe(concatCss('allDepCSS.css'))
  .pipe(uglifycss().on('error', function(e){ console.log(e); }))
  .pipe(gulp.dest("public/dependencies"));
});

gulp.task("minifyAndUglifyDep", gulpSequence("minifyAndUglifyDepJS", "minifyAndUglifyDepCSS"));

gulp.task('addInternalDep',['minifyAndUglifyDep'], function(){
  var elements = gulp.src("public/dependencies/**/*.*");
  return injectDep("internal", elements);
});


gulp.task('includeNewDep', function () {
   gulp.watch('bower.json', ['addInternalDep']);
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
				    args: ['--baseUrl', 'http://127.0.0.1:3000']
				}))
				.on('error', function(e) { throw e; });
});

gulp.task('serverStart', function () {
    // Start the server at the beginning of the task 
    expressServer.run(['./bin/www']);
});

gulp.task('serverStop', function () {
    // Start the server at the beginning of the task 
    expressServer.stop();
});

gulp.task("protractorConServer", gulpSequence("serverStart","protractor","serverStop"));

gulp.task("test", ["mocha", "karma", "protractorConServer"]);

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
gulp.task("default",["lint",'test']);
