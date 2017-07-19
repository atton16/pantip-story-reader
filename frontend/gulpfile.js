const gulp = require('gulp');
const minify = require('gulp-minifier');
const filter = require('gulp-filter');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();

gulp.task('build', function() {
  const pantipJsFilter = filter('src/pantip.js', {restore: true});
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

  return gulp.src('src/**/*')
    .pipe(pantipJsFilter)
    .pipe(dataDevProd)
    .pipe(pantipJsFilter.restore)
    .pipe(min)
    .pipe(gulp.dest('build'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  gulp.watch('src/**/*').on('change', browserSync.reload);
});

gulp.task('default', [ 'build' ]);