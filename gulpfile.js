// Import all packages needed for the build
var gulp = require('gulp');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');
var browserify = require('browserify');
var jquery = require('jquery');
var rename = require('gulp-rename');
var bulkify = require('bulkify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var hashify = require('gulp-hashify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var tap = require('gulp-tap');
var del = require('del');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var deploy = require('gulp-deploy-git');

// Common patterns used throughout the gulp configuration
var src = {
  allHtml: './src/**/*.html',
  allViews: './src/views/**/*.html',
  allJs: './src/**/**/**/*.{js,min.js}',
  allFonts: './src/**/**/*.{ttf,woff,otf,eot,svg}',
  allScss: './src/**/*.scss',
  allImg: './src/**/*.{jpg,png,svg,gif,ico,pdf,ogg}',
  allFav: './src/img/favicon/*.{png,ico}',
  allreadme:'.src/**.md'

};

// The default task is what runs when you type 'gulp' in the terminal
gulp.task('default', ['clean'], function () {
  return gulp.start('html', 'img', 'fonts', 'fav','js:views', 'js:vendor', 'js', 'scss', 'watch', 'reload', 'serve');
});

// Serve is a name I made up. You could call it 'dostuff' or whatever.
// The task starts a connect server on port 8000 if you go to
// http://localhost:8000, you can see what is being served.
gulp.task('serve', function () {
  connect.server({
    root: './dist', // Serve content out of the ./src folder
    port: 8000, // Serve on port 8000
    livereload: true // Allow us to reload the app in the browser at will
  });
});

// The watch task watches a directory for changes and tells the
// browser(s) connected to the server to refresh. I also made this name
// up. In fact, the only name that has intrinsic meaning to gulp is the
// 'default' task.
gulp.task('watch', function () {
  watch(src.allHtml, function () {
    gulp.start('html', 'js:views');
  });

  watch(src.allJs, function () {
    gulp.start('js');
  });

  watch(src.allScss, function () {
    gulp.start('scss');
  });

  watch(src.allImg, function () {
    gulp.start('img');
  });

  watch(src.allFonts, function () {
    gulp.start('fonts');
  });
});

// The reload task tells the connect server to reload all browsers
gulp.task('reload', function () {
  watch('./dist/**/*', function () {
    gulp.src('./dist/**/*').pipe(connect.reload());
  });
});


// // Deploy our src folder to gh-pages
// gulp.task('deploy', function() {
//   return gulp.src('./dist/**/*').pipe(ghPages());
// });


gulp.task('deploy', function() {
  return gulp.src('dist/**/**/*')
    .pipe(deploy({
      repository: 'https://github.com/NotoriousPAT/NotoriousPAT.github.io.git',
      prefix: 'dist',
      // message: 'gulp deploy',
      // remoteBranch:'testdeploy',
      // branches:'build',
      // debug:'true'
    }));
});









// this was working
// gulp.task('deploy', function() {
//   return gulp.src('dist/**/**')
//     .pipe(deploy({
//       repository: 'https://github.com/NotoriousPAT/NotoriousPAT.github.io.git',
//
//       // branch:'master'
//     }));
//
// });



// Adding the CSS task
gulp.task('scss', function () {
  return gulp.src('./src/css/main.scss')
    .on('error', swallowError)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('main.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css'));
});

// Build our JavaScript files using browserify
gulp.task('js', function () {
  var stream;

  try {
    stream = browserify('./src/js/init.js', { debug: true })
    .transform('bulkify')
    .transform({ global: true }, 'uglifyify')
    .external('views')
    .external('jquery')
    .external('underscore')
    .external('backbone')
    .external('parsleyjs')
    .bundle();
  } catch (ex) {
    console.error(ex);
    return;
  }

  return stream
     .on('error', swallowError)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'));
});

// Bundle vendor scripts (jQuery, Backbone, etc) into one script (vendor.js)
gulp.task('js:vendor', function () {
  return browserify({ debug: true })
    .transform({ global: true }, 'uglifyify')
    .require('jquery')
    .require('underscore')
    .require('backbone')
    .require('parsleyjs')

    .bundle()
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'));
});

// Turn all views into a JavaScript object
gulp.task('js:views', function () {
  return gulp.src(src.allViews)
    .pipe(hashify('bundled-views.js'))
    .pipe(tap(function(file) {
      return browserify()
        .require(file, { expose: 'views' })
        .bundle()
        .pipe(source('views.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist/js'));
    }));
});

// Let's move our html files into dest, too... Sometime, we'll modify this
// to do minification, cache-busting, etc...
gulp.task('html', function () {
  return gulp.src([src.allHtml, '!' + src.allViews])
    .pipe(gulp.dest('./dist'));
});

// Move any images to the dist folder
gulp.task('img', function () {
  return gulp.src(src.allImg)
    .pipe(gulp.dest('./dist'));
});

// Move any images to the dist folder
gulp.task('fav', function () {
  return gulp.src(src.allFav)
    .pipe(gulp.dest('./dist'));
});
// Move any fonts to the dist folder
gulp.task('fonts', function () {
  return gulp.src(src.allFonts)
    .pipe(gulp.dest('./dist'));
});



// var subtree = require('gulp-subtree');
//
//
// gulp.task('subtree', function () {
// 	return gulp.src('dist')
// 		.pipe(subtree({
//       remote: 'upstream',
// 			branch: 'master',
// 			message: 'Push compressed files to Master'
//     }))
//
// });



// gulp.task('build', function() {
//   return gulp.src('build/**')
//     .pipe(deploy({
//       repository: 'git@github.com:NotoriousPAT/NotoriousPAT.github.io.git',
//       prefix: 'build',
//       branch:'master'
//     }));
//
// });


// Clean the destination directory
gulp.task('clean', function (cb) {
     del(['./dist/css/*', './dist/css/fonts/*','./dist/img/*', './dist/img/favicon/*', './dist/js/*', './dist/404.html', './dist/index.html'], cb);
    
});


// Prevent gulp from crashing and leaving a running Node process behind
function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
};
