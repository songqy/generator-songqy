/*
 * @Description: file content
 * @Author: RongWei
 * @Date: 2019-10-24 20:09:06
 * @LastEditors: RongWei
 * @LastEditTime: 2019-10-25 10:58:33
 */
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const I18nPlugin = require('i18n-webpack-plugin');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const rootPath = path.resolve(__dirname, '../');
let isDevServer = process.env.WEBPACK_SERVE ? true : false;
let plugins = [
	new CleanWebpackPlugin(['dist'], {
		root: path.resolve(rootPath)
	}),
	/* compile主page */
	new HtmlWebpackPlugin({
		template: 'public/index.ejs',
		hash: true,
		env: process.env.MK_ENV || 'development',
		chunksSortMode: 'none'
	}),
	/* copy file */
	new CopyWebpackPlugin([
		{
			from: path.resolve(rootPath, 'public'), to: path.resolve(rootPath, 'dist'),
			ignore: ['*.ejs']
		},
		{
			from: 'node_modules/pdfjs-dist/cmaps/',
			to: 'cmaps/'
		},
	]),
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	new I18nPlugin({})
]
if (process.env.BUNDLE_ANA) {
	plugins.push(new BundleAnalyzerPlugin());
}

let config = {
	entry: ['babel-polyfill', './src/index.js'],
	output: {
		filename: 'bundle.[hash:8].js',
		// sourceMapFilename: "bundle.js.map",
		path: path.resolve(rootPath, 'dist'),
		chunkFilename: 'js/[name].[hash:8].bundle.js',
	},
	plugins: plugins,
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
				},
				resolve: {
					extensions: ['.js', '.jsx'],
				}
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name]-[hash:base64:8].[ext]',
							outputPath: 'static/'
						}
					}
				]
			}
		]
	},
	resolve: {
		alias: {
			'root': path.resolve(rootPath, 'src')
		},
		extensions: ['.js', '.jsx', '.less']
	}
}
if (isDevServer) {
	config.serve = {
		port: 8000,
		hot: {
			logLevel: 'warn'
		}
	}
}
module.exports = config;
