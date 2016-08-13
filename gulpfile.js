var gulp = require('gulp');
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