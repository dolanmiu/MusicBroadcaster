var gulp = require('gulp');
// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/,
    camelize: true
});
var mainBowerFiles = require('main-bower-files');


var srcDir = 'app';
var buildDir = 'build/'

gulp.task('clean', function () {
    return gulp.src('build', {
            read: false
        })
        .pipe(clean());
});

gulp.task('bowerjs', function () {
    return gulp.src(mainBowerFiles( /* options */ ), {
            base: '/bower_components'
        })
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(plugins.filesize())
        .on('error', plugins.util.log);
});

gulp.task('bowercss', function () {
    var cssFiles = ['src/css/*'];
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.order(['normalize.css', '*']))
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest(buildDir + 'css'))
        .on('error', plugins.util.log);
});

gulp.task('css', function () {
    var cssFiles = ['src/css/*'];
    gulp.src(plugins.mainBowerFiles().concat(cssFiles))
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('js', function () {
    return gulp.src(srcDir + '/client/**/*.js')
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.ngAnnotate())
        .pipe(gulp.dest(buildDir))
        .pipe(plugins.filesize())
        .pipe(plugins.uglify())
        .pipe(plugins.rename('app.min.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(plugins.filesize())
        .on('error', plugins.util.log)
});

gulp.task('index', function () {
    return gulp.src(srcDir + '/index.html')
        .pipe(plugins.htmlReplace({
            app: ['app.min.js'],
            lib: 'lib.js'
        }))
        .pipe(gulp.dest(buildDir))

});

gulp.task('build', ['bowerjs', 'js', 'index']);