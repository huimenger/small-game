var path = require( 'path' );
var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
var webpack = require( 'webpack' );

module.exports = {
	// 入口
	entry: {
		webapp: [ path.resolve( __dirname, '../../webapp' ) ],
		commons: [ 'vue', 'vue-router' ]
	},
	// 输出
	output: {
		path: path.resolve( __dirname, "../../../../dist" )
	},
	// 加载器
	module: {
		loaders: [
			{ test: /\.vue$/, loader: 'vue' },
			{ test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
			{ test: /\.css$/, loader: 'style!css!autoprefixer' },
			{ test: /\.less/, loader: 'style!css!less?sourceMap' },
			{ test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=8192' },
			{ test: /\.(html|tpl)$/, loader: 'html-loader' }
		]
	},
	// 转es5
	babel: {
        presets: [ 'es2015' ],
        plugins: [ 'transform-runtime' ]
    },
	resolve: {
		// require时省略的扩展名，如：require('module') 不需要module.js
		extensions: [ '', '.js', '.vue' ],
		// 别名，可以直接使用别名来代表设定的路径以及其他
		alias: {
			filter: path.join( __dirname, '../../filters' ),
			components: path.join( __dirname, '../../components' )
		}
	},
	plugins: [
		new HtmlWebpackPlugin( {                                                                        // 构建html文件
			filename: path.resolve( __dirname, "../../../../dist/index.html" ),
			template: path.resolve( __dirname, "../../../webapp.html" ),
			inject: 'body'
		} )
	]
};