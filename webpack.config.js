var webpack = require('webpack'),
    AssetsPlugin = require('assets-webpack-plugin'),
    path = require("path"),
    glob = require("glob");

module.exports.production = {
    context: path.resolve(__dirname, "src/"),
    cache: true,
    //页面入口文件配置
    entry: {
        webapp: path.resolve(__dirname, 'src/js/webapp.js')
    },
    //入口文件输出配置
    output: {
        path: __dirname + '/dist/js/',
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [{
                test: /\.html$/,
                loader: "vue"
            }, {
                test: /\.js$/,
                loader: "babel",
                include: path.resolve(__dirname, "src/js")
            }
            /*{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }*/
        ]
    },
    resolve: {
        //root: __dirname + "/src/js/",
        // alias: {
        //     zepto: __dirname + "/src/js/libs/zepto.js",
        //     vue: __dirname + "/src/js/libs/vue.min.js",
        //     store: __dirname + "/src/js/libs/store.js"
        // }
    },
    plugins: [
        new AssetsPlugin({
            filename: __dirname + '/dist/js/stats.json'
        })
    ]
};

module.exports.development = module.exports.production;
