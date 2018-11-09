const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const path = require("path");
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');               //清空打包目录
const uglify = require('uglifyjs-webpack-plugin');                      //代码压缩
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const Entries = {},HTMLPlugins = [new CleanWebpackPlugin("dist"),new webpack.HotModuleReplacementPlugin(),new uglify()];
let HTMLDirs = [
    'clip' ,
    'paging' ,
    'timepicker' ,
    'tab' ,
    'accordion' ,
    'scrollContainer',
    'ruler'
];
HTMLDirs.forEach( page  => {
    let htmlPlugin = new HTMLWebpackPlugin({
        filename: `${page}.html`,
        template: path.resolve(__dirname, `./src/${page}/test.html`),
        inject : true ,
        hash : true ,
        chunks: [page],
    });
    HTMLPlugins.push( htmlPlugin );
    Entries[page] = path.resolve(__dirname, `./src/${page}/test.js`);
});

module.exports={                                                        //暴露出来
    mode : "development" ,
    devtool: 'eval-source-map',
    entry : "./app.js" ,
    //entry: Entries ,
    output:{
        path:   path.resolve(__dirname,'dist'),                                  //dist绝对路径
        filename:'[name].bundle.min.js' ,                                     //打包后的出口和入口文件名一模一样
        //publicPath: './',
    },                                                                            //  出口文件配置
    module:{                                                                     //模块，例如CSS,图片转换，压缩
        rules : [
            {
                test: /\.js$/,
                exclude : /node_modules/,
                use : {
                    loader: 'babel-loader',
                }
            },
            {
                test  : /\.(png|jpg|gif|jpeg)$/,
                use : {
                        loader:'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
                    }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use : [
                    {loader: "style-loader"} ,
                    {loader: "css-loader"} ,
                ]
            },
            {
                test : /\.html$/ ,
                use : {
                    loader : "html-withimg-loader"
                }
            }
        ]
    },
    //plugins: HTMLPlugins ,                                                  //  插件,多个插件，所以是数组
    plugins : [
        new webpack.HotModuleReplacementPlugin() ,
        new HTMLWebpackPlugin({
            filename: `index.html`,
            template: path.resolve(__dirname, `./index.html`),
            inject : true ,
            hash : true ,
            //chunks: ["test"],
        })
    ] ,
    resolve : {
        extensions: ['.js']
    } ,
    devServer:{                                                             //  配置webpack服务
        contentBase:path.resolve(__dirname,'./'),
        port: 8060,
        host: 'localhost',
        compress:true,
        //inline: true,
        //hot: true,
        open: true
    }
}

