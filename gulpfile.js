const gulp = require('gulp');
const minify = require('gulp-minifier');
const filter = require('gulp-filter');
const replace = require('gulp-replace');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');

gulp.task('build/meta', function(){
  return gulp.src(['package.json', 'README.md', 'LICENSE']).pipe(gulp.dest('build'));
});
gulp.task('build/server', function(){
  const min = minify({
              minify: true,
              collapseWhitespace: true,
              conservativeCollapse: true,
              minifyJS: true,
              minifyCSS: false,
              getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
              }
            });
  return gulp.src(['src/**/*', '!src/public/mock', '!src/public/**/*'])
    .pipe(min)
    .pipe(gulp.dest('build'));
});
gulp.task('build/public', function() {
  const pantipJsFilter = filter('src/public/pantip.js', {restore: true});
  const dataDevProd = replace(/__DATAENV ?= ?('|")(prod|dev|mock)('|");?/g, '__DATAENV = \'prod\'');
  const min = minify({
              minify: true,
              collapseWhitespace: true,
              conservativeCollapse: true,
              minifyJS: true,
              minifyCSS: true,
              getKeptComment: function (content, filePath) {
                var m = content.match(/\/\*![\s\S]*?\*\//img);
                return m && m.join('\n') + '\n' || '';
              }
            });

  return gulp.src(['src/public/**/*', '!src/public/mock', '!src/public/mock/**/*'])
    .pipe(pantipJsFilter)
    .pipe(dataDevProd)
    .pipe(pantipJsFilter.restore)
    .pipe(min)
    .pipe(gulp.dest('build/public'));
});

gulp.task('nodemon', function() {
  var called = false;
  process.chdir('src');
  return nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  }).on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  }).on('restart', function () {
    setTimeout(function () {
      browserSync.reload({ stream: false });
    }, 1000);
  });
});

gulp.task('browser-sync', ['nodemon'], function() {
  setTimeout(function () {
    browserSync({
      proxy: "http://localhost:3010",
      notify: true
    });
    gulp.watch('src/**/*').on('change', browserSync.reload);
  }, 1000);
});

gulp.task('serve', [ 'browser-sync' ]);
gulp.task('build', [ 'build/meta', 'build/server', 'build/public' ]);
gulp.task('default', [ 'build' ]);