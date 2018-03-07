var webpack = require( "webpack" );
var WebpackDevServer = require( "webpack-dev-server" );
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
var config = require( './webpack.base.config' );
var open = require( "open" );
var port = 8000;

config.devtool = '#source-map';                             // source-map
config.output.publicPath = '/';                              // 资源路径
config.output.filename = '[name].js';                       // 入口js命名
config.output.chunkFilename = '[name].chunk.js';            // 路由js命名
config.entry.webapp.push( "webpack-dev-server/client?http://localhost:" + port );
config.entry.webapp.push( "webpack/hot/only-dev-server" );

config.vue = {
	loaders: {
		css: ExtractTextPlugin.extract(
			"style-loader",
			"css-loader?sourceMap",
			{
				publicPath: "/"
			}
		),
		less: ExtractTextPlugin.extract(
			'vue-style-loader',
			'css-loader!less-loader'
		),
		sass: ExtractTextPlugin.extract(
			'vue-style-loader',
			'css-loader!sass-loader'
		)
	}
};

config.plugins = (config.plugins || []).concat( [
	new ExtractTextPlugin( "[name].css", { allChunks: true, resolve: [ 'modules' ] } ),             // 提取CSS
	new webpack.optimize.CommonsChunkPlugin( 'commons', 'commons.js' ),                          // 提取第三方库
	new webpack.HotModuleReplacementPlugin()
] );

var compiler = webpack( config );
var server = new WebpackDevServer( compiler, {
	contentBase: "/",
	hot: true,
	inline: true,
	progress: true,
	historyApiFallback: true,
	stats: { colors: true },
} );

server.listen( port );
open( "http://localhost:" + port );