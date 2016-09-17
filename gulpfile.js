var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync= require('browser-sync');
// var nunjucks = require('gulp-nunjucks-render');
var watch = require('gulp-watch');
var csso = require('gulp-csso');
var imageop = require('gulp-image-optimization');
var postcss = require("gulp-postcss");
var autoprefixer = require('autoprefixer');
var mqpacker     = require('css-mqpacker');
var data = require('gulp-data');
var svgSprite  = require('gulp-svg-sprite');
var handlebars = require('gulp-handlebars');



gulp.task('templates', function(){
    gulp.src('pages/*.html')
        .pipe(handlebars())

        .pipe(gulp.dest('build/'));
});

config                  = {
    mode                    : {
        defs                : true,
        symbol              : true,
        stack               : true
    }
}

gulp.task('svg-sprite', function () {
    return gulp.src('src/svg-sprite/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest("build/svg"));
});



reload = browserSync.reload;


var processors = [
    autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
    }),
    mqpacker()
];

gulp.task('js', function () {
    gulp.src('src/js/*.js')

        // .on('error', function(){notify("Javascript include error");})
        //.pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(reload({stream: true}));
});

gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(csso())
        .pipe(gulp.dest('build/css'));

});

gulp.task('svg:sprites', function () {
    gulp.watch('src/svg-sprite/*.svg', ['svg-sprite']);
});
gulp.task('js:watch', function () {
    gulp.watch('src/js/*.js', ['js']);
});

gulp.task('sass:watch', function () {
    gulp.watch('src/sass/*.scss', ['sass']);
});
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });
});
//  gulp.task('nunjucks', function() {
//     return gulp.src('src/pages/*.html')
//         // .pipe(data(function() {
//         //     return require('../app/data.json')
//         // }))
//         .pipe(nunjucks(
//             {
//                 path: ['src/'] // String or Array
//             }
//         ))
//         .pipe(gulp.dest('build/'));
// });
gulp.task('images', function(cb) {
    gulp.src(['src/img/*.png','src/img/*.jpg','src/img/*.gif','src/img/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('build/img')).on('end', cb).on('error', cb);
});

gulp.task('fonts', function() {
    return gulp.src(['src/fonts/**'])
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('templates:watch', function () {
    gulp.watch('src/pages/*.html', ['templates']);
});



gulp.task('watch',
    [
        'sass:watch',
        'templates:watch',
        'js:watch',
        'svg:sprites'

    ]
);
gulp.task('build',
    [
        'sass',
        'templates',
        'images',
        'fonts',
        'svg:sprites'

    ]
);
gulp.task('default', ['server','watch'], function() {});