var webpack = require('webpack');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackDevServer = require('webpack-dev-server');
var config = require("./webpack.config.js");

// config.entry.index.unshift('webpack/hot/dev-server');
// config.entry.index.unshift('webpack-dev-server/client?http://localhost:8080');

var compiler = webpack(config);

var server = new webpackDevServer(compiler, {
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: 'errors-only',
    host: "localhost",
    port: "8080",
    open: true
});
server.listen(8080);