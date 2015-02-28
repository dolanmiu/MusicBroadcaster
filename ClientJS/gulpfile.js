var gulp = require('gulp');
// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/,
    camelize: true
});
var wiredep = require('wiredep').stream;

var srcDir = 'app/';
var buildDir = 'build/';

var paths = {
    angular: [srcDir + 'client/**/*.js']
};

gulp.task('clean', function () {
    return gulp.src('build', {
            read: false
        })
        .pipe(clean());
});

gulp.task('bowerjs', function () {
    return gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.concat('lib.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(buildDir))
        .pipe(plugins.filesize())
        .on('error', plugins.util.log);
});

gulp.task('bowercss', function () {
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.order(['normalize.css', '*']))
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.concat('lib.css'))
        .pipe(gulp.dest(buildDir + 'css'))
        .on('error', plugins.util.log);
});

gulp.task('appjs', function () {
    return gulp.src(srcDir + '/client/**/*.js')
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.ngAnnotate())
        .pipe(gulp.dest(buildDir))
        .pipe(plugins.filesize())
        .pipe(plugins.uglify())
        .pipe(plugins.rename('app.min.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(plugins.filesize())
        .on('error', plugins.util.log);
});

gulp.task('css', function () {
    return gulp.src(srcDir + '/assets/css/*.css')
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest(buildDir + 'css'))
        .pipe(plugins.filesize())
        .on('error', plugins.util.log);
});

gulp.task('js', function () {
    return gulp.src(srcDir + '/assets/js/*.js')
        .pipe(plugins.concat('scripts.js'))
        .pipe(gulp.dest(buildDir + 'js'))
        .pipe(plugins.filesize())
        .on('error', plugins.util.log);
});

gulp.task('indexjs', function () {
    return gulp.src(srcDir + '/index.html')
        .pipe(plugins.htmlReplace({
            app: ['app.min.js'],
            css: 'css/main.css',
            lib: 'lib.js',
            libcss: 'css/lib.css',
            js: 'js/scripts.js'
        }))
        .pipe(gulp.dest(buildDir));
});

gulp.task('build', ['bowerjs', 'bowercss', 'appjs', 'css', 'js', 'index']);

gulp.task('srcbowerjs', function () {
    /*var target = gulp.src(srcDir + 'index.html');
    var sources = gulp.src(plugins.mainBowerFiles(), { base: 'path/to/bower_components' });
    
    return target.pipe(plugins.inject(sources))
        .pipe(gulp.dest(srcDir))
        .on('error', plugins.util.log);*/

    return gulp.src(srcDir + 'index.html')
        .pipe(wiredep())
        .pipe(gulp.dest(srcDir))
        .on('error', plugins.util.log);
});

gulp.task('srcbowercss', function () {
    return gulp.src(srcDir + 'index.html')
        .pipe(wiredep())
        .pipe(gulp.dest(srcDir))
        .on('error', plugins.util.log);
});

gulp.task('angular', function () {
    var target = gulp.src(srcDir + 'index.html')

    var sources = gulp.src(paths.angular, {
        read: false
    });

    return target.pipe(plugins.inject(sources, {
            ignorePath: '/build/',
            addRootSlash: false,
            relative: true
        }))
        .pipe(gulp.dest(srcDir));
});

gulp.task('watch', function () {
    gulp.watch(paths.angular, ['angular']);
});

gulp.task('build', ['bowerjs', 'bowercss', 'appjs', 'css', 'js', 'index']);
gulp.task('bower', ['srcbowerjs', 'srcbowercss']);