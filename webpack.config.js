const path = require( 'path' );

const TerserPlugin = require( 'terser-webpack-plugin' );

let config = {
	entry: './src/main.js',
	output: {
		filename: 'main.js',
		path: path.resolve( __dirname, 'dist' ),
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ]
					}
				},
			}, {
				test: /\.(glsl)$/,
				exclude: /node_modules/,
				loader: 'raw-loader',
			},
		],
	},
	resolve: {
		alias: {
			keda: path.resolve( __dirname, './src/keda/' ),
		},
	},
	optimization: {
		minimize: false,
	},
};

module.exports = ( env, argv ) => {

	if ( argv.mode === 'development' ) return {
		...config,
		mode: 'development',
		devtool: 'inline-source-map',
		devServer: {
			static: {
				directory: path.resolve( __dirname, 'dist' ),
			},
			host: '192.168.1.10',
			port: 8080,
		},
	};

	return {
		...config,
		mode: 'production',
		externals: {
			animejs: 'anime',
			three: 'THREE',
		},
		optimization: {
			minimize: true,
			usedExports: true,
			minimizer: [ new TerserPlugin( { extractComments: false } ) ],
		},
	};

};
