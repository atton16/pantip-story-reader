var gulp = require('gulp');
var minify = require('gulp-minifier');
var browserSync = require('browser-sync').create();

gulp.task('build', function() {
  return gulp.src('src/**/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
      var m = content.match(/\/\*![\s\S]*?\*\//img);
      return m && m.join('\n') + '\n' || '';
    }
  })).pipe(gulp.dest('build'));
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