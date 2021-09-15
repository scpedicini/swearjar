const gulp = require('gulp');
const terser = require('gulp-terser');
const cleancss = require('gulp-clean-css');

// The src() and dest() methods are exposed by gulp to interact with files on your computer.
function jsMinifyTask(cb) {
    return gulp.src('./js/*.js') // (['./js/client.js', './js/animation.js'])
        .pipe(terser())
        .pipe(gulp.dest('./build/js'));
}

function cssMinifyTask(cb) {
    return gulp.src('css/*.css')
        .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./build/css'));
}

function copyFilesTask(cb) {
    return gulp.src('index.html')
        .pipe(gulp.dest('./build'));
}

function emptyTask(cb) {
    // place code for your default task here
    cb(); // use the callback function if you are not returning data
}

//exports.default = gulp.series(emptyTask, minifyTask);
exports.default = gulp.parallel(emptyTask, jsMinifyTask, cssMinifyTask, copyFilesTask);