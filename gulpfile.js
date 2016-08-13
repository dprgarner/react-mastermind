var gulp = require('gulp');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var webpack = require('webpack');

gulp.task('build', function (done) {
  webpack(require('./webpack.conf.js'), function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log(stats.toString({
      chunks: false,
      colors: true,
      hash: false,
    }));
    done();
  });
});
 
gulp.task('serve', function() {
  connect.server({
    root: 'build',
    livereload: true,
    port: 80,
    debug: true,
  });
});

gulp.task('watch', function () {
  gulp.watch(['./build/*'], function () {
    gulp.src('./build/*').pipe(connect.reload());
  });
});
 
gulp.task('watchbuild', ['serve', 'watch'], function () {
  gulp.watch(['./src/*'], ['build']);
});