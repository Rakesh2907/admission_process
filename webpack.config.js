var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {
  entry: [
    'script!jquery/dist/jquery.min.js',
    'script!foundation-sites/dist/js/foundation.min.js',
    './app/app.jsx'
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
    /*new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      noInfo: true, // set to false to see a list of every file being bundled.
      options: {
        sassLoader: {
          includePaths: [path.resolve(__dirname, 'node_modules/foundation-sites/scss')]
        },
        context: '/',
        postcss: () => [autoprefixer],
      }
    }),*/
    new webpack.DefinePlugin({
         'process.env': {
            NODE_ENV: JSON.stringify('production')
          },
          __DEV__: false
    }),
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js',
    publicPath: '/'
  },
  resolve: {
    root: __dirname,
    alias: {
      Admission: 'app/components/Admission.jsx',
      Razorpayment: 'app/components/Razorpayment.jsx',
      LoginForm: 'app/components/LoginForm.jsx',
      ForgotPassword: 'app/components/ForgotPassword.jsx'
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
       { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
       { test: /\.json$/, loader: 'json-loader' },
       { test: /\.css$/, loader: 'style-loader!css-loader' },
       { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
       {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  sassLoader: {
	  includePaths: [
		path.resolve(__dirname, 'node_modules/foundation-sites/scss')			 
	  ]
  },
  devtool: 'cheap-module-eval-source-map'
};
