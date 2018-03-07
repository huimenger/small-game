
var gulp = require("gulp"),
    gutil = require("gulp-util"),
    del = require("del"),
    less = require("gulp-less"),
    minify = require("gulp-minify-css"),
    uglify = require("gulp-uglify"),
    webpack = require("webpack"),
    // webpack配置文件
    //webpackConfig = require("./webpack.config.js"),
    // 是否是调试模式
    isDevelopmentMode = process.argv.indexOf("--dev") > -1,
    ftp = require("gulp-ftp");

function upload(remotePath) {
    return ftp({
        host: "121.42.50.128",
        user: "ftpUser",
        pass: "killers8Y",
        port: "21",
        remotePath: remotePath
    });
}

gulp.task("less", function() {
    gulp.src("css/core.less")
        .pipe(less())
        .pipe(minify())
        .pipe(gulp.dest("css/"));
});

gulp.task("webpack", function(callback) {
    del.sync(["dist/js/**/*.*"]);
    webpack(
        isDevelopmentMode ? webpackConfig.development : webpackConfig.production,
        function(err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
                colors: true
            }));
            callback();
        }
    );
});

gulp.task("watch", function() {
    //gulp.watch(["js/main.js","!*main-built.js"], ["rjs"]);
    gulp.watch("css/**/*.less", ["less"]);
    gulp.watch("src/js/**/*.js", ["webpack"]);
});

gulp.task("ftp", function() {
    gulp.src("js/main-built.js")
        .pipe(upload("/RQSTools/GoodBooks.Web.Main.Sxyj/webapp/js"))
        .pipe(upload("/RQSTools/GoodBooks.Web.Main/webapp/js"));
});
