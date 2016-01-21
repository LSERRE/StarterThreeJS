// source: https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var prefix = require('gulp-autoprefixer');

// browserify
var customOpts = {
    entries: ['./assets/js/index.js'],
    debug: true,
    fast: gutil.env.type === 'production' ? false : true,

    // require(/path/to/file.js) directly from those paths
    paths: [
        './node_modules',
        './assets/js/',
        './assets/js/helpers',
        './assets/js/lib',
        './assets/js/lib/gsap/src/uncompressed',
        './assets/js/modules',
        './assets/js/partials',
    ]
};

var opts = assign({}, watchify.args, customOpts);
var b = browserify(opts);
var w = watchify(b);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
w.on('update', bundle); // on any dep update, runs the bundler
w.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
      .pipe(gutil.env.type !== 'production' ? sourcemaps.write('.', {sourceRoot: '/assets/js'}): gutil.noop())
      .pipe(gutil.env.type === 'production' ? gutil.noop() : gulp.dest('./assets/js'))
      .pipe(gutil.env.type === 'production' ? rename({suffix: '.min'}) : gutil.noop())
      .pipe(gutil.env.type === 'production' ? gulp.dest('./assets/js') : gutil.noop())
      .pipe(gutil.env.type === 'production' ? stripDebug() : gutil.noop())
      .pipe(livereload({start: true}));
}

// sass
gulp.task('sass', function () {
    var cssStyle = gutil.env.type === 'production' ? 'compressed' : 'nested';

    return sass('./assets/scss/main.scss', {
      sourcemap: gutil.env.type !== 'production',
      style: cssStyle
    })
    .pipe(prefix())
    .pipe(sourcemaps.write('.', {
        includeContent: false,
        sourceRoot: './assets/scss'
    }))
    .pipe(gutil.env.type === 'production' ? rename({suffix: '.min'}) : gutil.noop())
    .pipe(gulp.dest('./assets/styles/'))
    .pipe(livereload());
});

gulp.task('watch', function() {
    gulp.watch('./assets/scss/**/*.scss', ['sass'])
    .on('change', function(evt) {
        console.log(
            '[watcher] File ' + evt.path.replace(/.*(?=scss)/,'') + ' was ' + evt.type + ', compiling...'
        );
    });
});


// default
gulp.task('default', ['js', 'sass', 'watch']);
