const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const { getShared } = require('@bit/blume-ui.react-components.module-federation');
const packageJson = require('./package');
const DashboardPlugin = require('@module-federation/dashboard-plugin');

const shared = getShared(packageJson);
delete shared['@bit/blume-ui.react-components.blume-grid'];
delete shared['@material-ui/core'];
delete shared['@material-ui/styles'];

// FOR LOCAL CODE SETUP
const isLocal = false;
const publicPath = isLocal ? 'http://localhost:3000/unit-test-generator/' : '/unit-test-generator/'; //comment on prod

module.exports = {
	entry: 'indexDev',
	output: {
		path: __dirname + '/dist',
		publicPath: isLocal ? publicPath : 'auto',
		filename: 'js/[name].js'
	},
	resolve: {
		modules: ['node_modules', 'src'],
		alias: { src: path.resolve(__dirname, 'src') },
		extensions: ['.js', '.jsx', '.mjs']
	},
	module: {
		rules: [
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'static/media/[name].[hash:8].[ext]',
							esModule: false
						}
					}
				]
			},
			{
				test: /\.(WOFF|WOFF2|TTF|OTF|EOT)$/i,
				loader: 'file-loader',
				options: {
					name: 'static/media/[name].[hash:8].[ext]'
				}
			},
			{
				test: /bootstrap\.js$/,
				loader: 'bundle-loader',
				options: {
					lazy: true
				}
			},
			{
				test: /\.(js|mjs|jsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.css$/i,
				oneOf: [
					{
						exclude: /node_modules/,
						use: ['style-loader', 'css-loader', 'postcss-loader']
					},
					{
						use: ['style-loader', 'css-loader']
					}
				]
			},
			{
				test: /\.s[ac]ss$/i,
				oneOf: [
					{
						exclude: /node_modules/,
						use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
					},
					{
						use: ['style-loader', 'css-loader', 'sass-loader']
					}
				]
			}
		]
	},

	// mode: 'development', //comment on prod
	mode: isLocal ? 'development' : 'production',
	devServer: {
		historyApiFallback: true,
		// contentBase: './dist',
		open: true,
		compress: true,
		hot: true,
		port: 3000
		// publicPath: publicPath
	},

	plugins: [
		new webpack.ProvidePlugin({
			process: 'process/browser',
			Buffer: ['buffer', 'Buffer']
		}),
		new CleanWebpackPlugin(),
		new DashboardPlugin({
			filename: 'dashboard.json',
			metadata: {
				source: {
                    ///ye change karna hai
					url: 'https://github.com/rez-one/platform-master-data-ui-cas-micro-ui-new'
				}
			}
		}),
		new ModuleFederationPlugin({
			name: 'unit_test_generator',
			library: { type: 'var', name: 'unit_test_generator' },
			filename: 'unitTestGenerator.js',
			exposes: {
				'./UnitTestGenerator': './src/App'
			},
			shared
		}),
		new CopyPlugin({
			patterns: [
				{
					context: __dirname + '/public',
					from: './**',
					filter: async path => {
						return path.split('.').pop() !== 'html';
					},
					to: __dirname + '/dist'
				}
			]
		}),
		new HtmlWebpackPlugin({
			title: 'Unit Test Generator',
			template: './public/index.html',
			templateParameters: {
				PUBLIC_URL: '/unit-test-generator'
			}
		})
	]
};
