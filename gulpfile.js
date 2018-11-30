//####################################### REQUIRIMENTS ################################
var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var srcmaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var wait = require('gulp-wait');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var webpack = require('webpack');
var plumber = require('gulp-plumber');
var svgSprite = require('gulp-svg-sprite');
var del = require('del');
var spritesmith = require('gulp.spritesmith');

//####################################### PATHS #######################################
var PORT = 5639;
var ROOT_FOLDER = '/sinner/default/project';
//var PROJECT_FOLDER = '/default/wordpress';
//var CUSTOM_THEME_NAME = 'customThemeName';
var DIR_PATH = './projectName';
var URLTOPREVIEW = 'http://localhost:' + PORT + ROOT_FOLDER + DIR_PATH.replace('.', '') + '/';
var SASS_PATH = DIR_PATH + '/dev/scss/**/*.scss';
var CSS_TO_MIN = DIR_PATH + '/dist/css/style.css';
var MIN_CSS = DIR_PATH + '/dist/css/style.min.css';
var JS_PATH = DIR_PATH + '/dev/js/**/*.js';
var JS_TO_MIN = DIR_PATH + '/dist/js/main.js';

//####################################### TASKS #######################################
gulp.task('default', function() {
    console.log('Gulp says \"Hi\".');
})

//------------------------------------ COMPILE SASS
gulp.task('sass', function() {
    console.log('Sass task');
    return gulp.src(SASS_PATH)
        .pipe(plumber(function(err) {
            console.log('SASS task error:');
            console.log(err);
        }))
        .pipe(wait(500))
        .pipe(srcmaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(srcmaps.write('/'))
        // .on('error', function(errorInfo) {
        //     console.log(errorInfo.toString());
        //     this.emit('end');
        // })
        .pipe(gulp.dest(DIR_PATH + '/dist/css/'));
});

//------------------------------------ MINIFY CSS
gulp.task('minifyCSS', ['sass'], function() {
    console.log('Minify css task');
    return gulp.src(CSS_TO_MIN)
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .on('error', function(errorInfo) {
            console.log(errorInfo.toString());
            this.emit('end');
        })
        .pipe(gulp.dest(DIR_PATH + '/dist/css/'));
})

//------------------------------------ COMPILE JS

gulp.task('scripts', function(callback) {
    webpack(require('./webpack.config'), function(err, stats) {
        if (err) {
            console.log(err.toString());
        }
        console.log(stats.toString());
        callback();
    })
});

//------------------------------------ WATCH
gulp.task('watch', function() {
    browserSync.init({
        notify: false,
        ghostMode: false,
        //port: PORT,
        //proxy: URLTOPREVIEW,
        server: {
            baseDir: DIR_PATH
        }
    });
    //Watch PHP for changes
    gulp.watch(DIR_PATH + '/**/*.php', function() {
        browserSync.reload();
    });
    //Watch HTML for changes
    gulp.watch(DIR_PATH + '/*.html', function() {
        browserSync.reload();
    });
    //Watch CSS for changes
    gulp.watch(SASS_PATH, ['cssInject']);
    //Watch JS for changes
    gulp.watch(JS_PATH, function() {
        gulp.start('scriptsReload');
    });
})

//------------------------------------ CSS INJECT

gulp.task('cssInject', ['minifyCSS'], function() {
    return gulp.src(MIN_CSS)
        .pipe(browserSync.stream());
});

//------------------------------------ JS RELOAD
gulp.task('scriptsReload', ['scripts'], function() {
    browserSync.reload();
});

//------------------------------------ SPRITE PNG, JPEG, JPG IMAGES
gulp.task('spritePNG', function() {
    var spriteData = gulp.src(DIR_PATH + '/dev/img/**/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'spritePNG.css'
        }));
    return spriteData.pipe(gulp.dest(DIR_PATH + '/dev/temp/img/sprite'));
});

gulp.task('spriteJPEG', function() {
    var spriteData = gulp.src(DIR_PATH + '/dev/img/**/*.{jpeg,jpg}')
        .pipe(spritesmith({
            imgName: 'sprite.jpeg',
            cssName: 'spriteJPEG.css'
        }));
    return spriteData.pipe(gulp.dest(DIR_PATH + '/dev/temp/img/sprite'));
});

gulp.task('spriteALL', ['spritePNG', 'spriteJPEG'], function() {
    console.log('Image files sprited');
});

//------------------------------------ SPRITE SVG IMAGES
var config = {
    mode: {
        css: {
            sprite: 'sprite.svg',
            render: {
                css: {
                    template: DIR_PATH + '/dev/template/sprite.css'
                }
            }
        }
    }
}

//---delete temp folders/files
gulp.task('beginClean', function() {
    return del([DIR_PATH + '/dev/temp/sprite', DIR_PATH + '/dev/img/sprites']);
});

//--create sprites
gulp.task('createSprite', ['beginClean'], function() {
    return gulp.src(DIR_PATH + '/dev/img/toSprite/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest(DIR_PATH + '/dev/temp/sprite/'));
});

//--copy svgs
gulp.task('copySpriteGraphic', ['createSprite'], function() {
    return gulp.src(DIR_PATH + '/dev/temp/sprite/css/**/*.svg')
        .pipe(gulp.dest(DIR_PATH + '/dist/img/sprites'));
});
//--copy css
gulp.task('copySpriteCSS', ['createSprite'], function() {
    return gulp.src(DIR_PATH + '/dev/temp/sprite/css/*.css')
        .pipe(rename('spriteSVG.css'))
        .pipe(gulp.dest(DIR_PATH + '/dist/css'));
});

gulp.task('endClean', ['copySpriteGraphic', 'copySpriteCSS'], function() {
    return del(DIR_PATH + '/dev/temp/sprite');
});

gulp.task('icons', ['beginClean', 'createSprite', 'copySpriteGraphic', 'copySpriteCSS', 'endClean']);

//------------------------------------ COMPRESS IMAGES
gulp.task('compress', function() {
    console.log('Starting compress task...');
    return gulp.src(DIR_PATH + '/dist/img')
        .pipe(imagemin([
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo(),
            pngquant(),
            jpegrecompress()
        ]))
        .pipe(gulp.dest(DIST_PATH + '/dist/img'));
});