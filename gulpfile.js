'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var extender = require('gulp-html-extend');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

var pub = './dist/';
var src = './src/';

gulp.task('js', function () {
    gulp.src(src + 'js/**/*.*')
        .pipe(gulp.dest(pub + 'js/'))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    gulp.src(src + 'sass/index.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(pub + 'css'))
        .pipe(browserSync.stream());
});

gulp.task('directory', function () {
    gulp.src(src + 'fonts/**/*.*')
        .pipe(gulp.dest(pub + 'fonts/'));
    gulp.src(src + 'svg/**/*.*')
        .pipe(gulp.dest(pub + 'svg/'));
});

// gulp.task('jade', function () {
//     return gulp.src(src + 'templates/jade/*.jade')
//         .pipe(jade())
//         .pipe(gulp.dest(pub))
//         .pipe(browserSync.stream());
// });

gulp.task('extend', function () {
    gulp.src(src + 'templates/*.html')
        .pipe(extender({annotations:true,verbose:false})) // default options
        .pipe(gulp.dest(pub))

});

gulp.task('sync', function () {
    browserSync.init({
        server: {
            baseDir: pub
        },
        port: '3000',
        ghostMode: false,
        open: false,
        serveStatic: [src]
    });

    gulp.watch(
        [ '*.html' ],
        { cwd: pub },
        browserSync.reload
    );
});

gulp.task('watchers', function() {
    gulp.watch(src + 'sass/**/*.scss', ['sass']);
    gulp.watch(src + 'templates/**/*.html', ['extend']);
    gulp.watch(src + 'js/**/*.*', ['js']);
});

gulp.task(
    'default',
    [
        'watchers',
        'sass',
        'directory',
        'extend',
        'js',
        'sync'
    ]
);