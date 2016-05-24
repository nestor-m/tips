var gulp = require('gulp');
inject = require("gulp-inject"); 

gulp.task('default', function () { console.log('Hello Gulp!') });

function injectDep(pathToDep, tag){
	var factories = gulp.src(pathToDep);

	return gulp.src("views/index.ejs").pipe(inject(factories, {
		starttag: '<!-- inject:' + tag + ' -->',
    	endtag: '<!-- endinject -->',
		ignorePath: "public",
		addRootSlash : true
	})).pipe(gulp.dest("views"))
}

gulp.task('addFactoriesDep', function(){
	injectDep("public/javascripts/factories/**/*.js", "factories");
});

gulp.task('addControllersDep', function(){
	injectDep("public/javascripts/controllers/**/*.js", "controllers");
});

gulp.task("addAllDep", ["addFactoriesDep", "addControllersDep"]);