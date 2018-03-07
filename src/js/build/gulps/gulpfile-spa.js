
var gulp = require("gulp"),
    gutil = require("gulp-util"),
    less = require("gulp-less"),
    minify = require("gulp-minify-css"),
    uglify = require('gulp-uglify'),
    connect = require("gulp-connect"),
    rollup = require("gulp-rollup-stream"),
    //vuefile = require("../../plugins/rollup-plugin-vuefile"),
    nodeResolve = require("rollup-plugin-node-resolve"),
    commonjs = require("rollup-plugin-commonjs"),
    buble = require("rollup-plugin-buble"),
    path = require("path"),
    fs = require("fs"),
    proxy = require("http-proxy-middleware"),
    minifyHtml = require('gulp-minify-html'),
    // 编译Handlebars模板
    handlebars = require('gulp-compile-handlebars'),
    // Handlebars的扩展，布局支持
    layouts = require("handlebars-layouts"),
    // 是否是调试模式
    isDevelopmentMode = process.argv.indexOf("--dev") > -1;
layouts.register(handlebars.Handlebars);
console.log(isDevelopmentMode ? "=====开发调试模式=====" : "=====生产模式=====");
var root = path.resolve(__dirname, "../../../");
var paths = {
    jsPath: path.resolve(root, "js/spa/*.js"),
    lessPath: path.resolve(root, "less/spa/*.less"),
    jsonPath: path.resolve(root, "json/spa/*.json"),
    hbsPagePath: path.resolve(root, "hbs/spa/*.hbs"),
    hbsPartialsPath: path.resolve(root, "hbs/partials/"),
    jsBasePath: path.resolve(root, "js/spa/"),
    lessBasePath: path.resolve(root, "less/spa/"),
    jsonBasePath: path.resolve(root, "json/spa/"),
    hbsPageBasePath: path.resolve(root, "hbs/spa/")
};
gulp.task("spa:watch", function() {
    gulp.watch([paths.jsPath, paths.lessPath, paths.jsonPath, paths.hbsPagePath], function(event) {
        if (event.type === "deleted") return;
        // 变动文件的路径
        var p = event.path;
        // 变动的文件名
        var name = path.basename(p, path.extname(p));
        checkFiles(name);
        var pageFile = -1,
            jsFile = -1,
            cssFile = -1,
            jsonData = {};
        var done = function() {
            if (pageFile !== -1 && jsFile !== -1 && cssFile !== -1) {
                var headCloseIndex = pageFile.indexOf("</head>");
                var bodyCloseIndex = pageFile.indexOf("</body>");
                if (isDevelopmentMode) {
                    // 开发模式=输入加上缩进和换行
                    jsFile = jsFile.trim();
                    cssFile = cssFile.trim();
                    jsFile = jsFile.replace(/\r\n/g, "\n");
                    cssFile = cssFile.replace(/\r\n/g, "\n");
                    jsFile = jsFile.replace(/\n/g, "\r\n\t\t");
                    cssFile = cssFile.replace(/\n/g, "\r\n\t\t");
                    pageFile = pageFile.substring(0, bodyCloseIndex) + "\r\n\t<script>\r\n\t\t" + jsFile + "\r\n\t</script>\n" + pageFile.substring(bodyCloseIndex);
                    pageFile = pageFile.substring(0, headCloseIndex) + "\r\n\t<style>\r\n\t\t" + cssFile + "\r\n\t</style>\n" + pageFile.substring(headCloseIndex);
                }
                else {
                    // 生产模式=输入去掉缩进和换行
                    pageFile = pageFile.substring(0, bodyCloseIndex) + "<script>" + jsFile + "</script>" + pageFile.substring(bodyCloseIndex);
                    pageFile = pageFile.substring(0, headCloseIndex) + "<style>" + cssFile + "</style>" + pageFile.substring(headCloseIndex);
                }
                var filename = path.resolve(__dirname, "../../../../spa/" + name + ".html");
                buildPageFile(pageFile, filename, function() {
                    gulp.src(filename).pipe(connect.reload());
                });
            }
        };
        // 读入JSON数据
        if (fs.existsSync(path.resolve(paths.jsonBasePath), name + ".json")) {
            var content = fs.readFileSync(path.resolve(paths.jsonBasePath, name + ".json"), "utf-8");
            if (content.length > 0) {
                jsonData = JSON.parse(content.trim());
            }
        }
        // 读入页面文件
        gulp.src(path.resolve(paths.hbsPageBasePath, name + ".hbs")).pipe(handlebars(jsonData, {
            ignorePartials: true,
            partials: {},
            batch: [paths.hbsPartialsPath],
            helpers: {}
        })).pipe(isDevelopmentMode ? gutil.noop() : minifyHtml()).on("data", function(file) {
            pageFile = file.contents.toString();
            done();
        });
        // 读入js文件
        gulp.src(path.resolve(paths.jsBasePath, name + ".js")).pipe(rollup({
            format: 'cjs',
            plugins: [
                //vuefile(),
                nodeResolve({
                    jsnext: true,
                    main: true
                }),
                commonjs(),
                buble()
            ]
        })).pipe(isDevelopmentMode ? gutil.noop() : uglify()).on("data", function(file) {
            jsFile = file.contents.toString();
            done();
        });
        // 读入样式文件
        gulp.src(path.resolve(paths.lessBasePath, name + ".less")).pipe(less()).pipe(isDevelopmentMode ? gutil.noop() : minify()).on("data", function(file) {
            cssFile = file.contents.toString();
            done();
        });
    });
});
gulp.task("spa:connect", function() {
    connect.server({
        root: path.resolve(__dirname, "../../../../spa"),
        livereload: true,
        port: 8080,
        middleware: function(conncet, options) {
            return [
                proxy("/WebApi", {
                    target: "http://localhost:5349/",
                    changeOrigin: true
                })
            ];
        }
    });
});
gulp.task("spa", ["spa:watch", "spa:connect"]);

function checkFiles(name) {
    var files = [
        path.resolve(paths.jsonBasePath, name + ".json"),
        path.resolve(paths.jsBasePath, name + ".js"),
        path.resolve(paths.lessBasePath, name + ".less"),
        path.resolve(paths.hbsPageBasePath, name + ".hbs")
    ];
    files.forEach(function(file) {
        if (!fs.existsSync(file)) {
            fs.writeFile(file, "", function(err) {
                if (err) throw err;
                console.log("自动创建 " + file);
            });
        }
    });
}

function buildPageFile(content, filename, callback) {
    if (fs.existsSync(filename)) fs.unlink(filename);
    mkdirs(path.dirname(filename), 0, function() {
        fs.writeFile(filename, content, function(err) {
            if (err) throw err;
            var time = new Date();
            console.log("[" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "] " + "生成页面文件:" + filename);
            if (callback) callback();
        });
    });
}

function mkdirs(dirpath, mode, callback) {
    fs.exists(dirpath, function(exists) {
        if (exists) {
            callback(dirpath);
        }
        else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), mode, function() {
                fs.mkdir(dirpath, mode, callback);
                console.log("创建目录：" + dirpath);
            });
        }
    });
};
