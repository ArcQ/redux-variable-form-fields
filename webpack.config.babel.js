import * as path from 'path';
/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SystemBellPlugin from 'system-bell-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import merge from 'webpack-merge';
/* eslint-enable */


const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event || '';
const ROOT_PATH = __dirname;
const config = {
  paths: {
    dist: path.join(ROOT_PATH, 'dist'),
    src: path.join(ROOT_PATH, 'src'),
    docs: path.join(ROOT_PATH, 'docs'),
  },
  filename: 'variable-form-fields',
  library: 'variable-form-fields',
};

process.env.BABEL_ENV = TARGET;

const common = {
  resolve: {
    root: config.paths.src,
    extensions: ['', '.js', '.jsx', '.css', '.png', '.jpg'],
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [
          config.paths.docs,
          config.paths.src,
        ],
      },
    ],
    loaders: [
      {
        test: /\.md$/,
        loaders: ['catalog/lib/loader', 'raw'],
      },
      {
        test: /\.png$/,
        loader: 'url?limit=100000&mimetype=image/png',
        include: config.paths.docs,
      },
      {
        test: /\.jpg$/,
        loader: 'file',
        include: config.paths.docs,
      },
      {
        test: /\.json$/,
        loader: 'json',
        include: path.join(ROOT_PATH, 'package.json'),
      },
    ],
  },
  plugins: [
    new SystemBellPlugin(),
  ],
};

const siteCommon = {
  plugins: [
    new HtmlWebpackPlugin({
      /* eslint-disable */
      template: require('html-webpack-template'),
      /* eslint-enable */
      inject: false,
      mobile: true,
      title: pkg.name,
      appMountId: 'app',
    }),
    new webpack.DefinePlugin({
      NAME: JSON.stringify(pkg.name),
      USER: JSON.stringify(pkg.user),
      VERSION: JSON.stringify(pkg.version),
    }),
  ],
};

// if (TARGET === 'start') {
if (TARGET === 's') {
  module.exports = merge(common, siteCommon, {
    devtool: 'eval-source-map',
    entry: {
      docs: [config.paths.docs],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"',
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
        },
        {
          test: /\.jsx?$/,
          loaders: ['babel?cacheDirectory'],
          include: [
            config.paths.docs,
            config.paths.src,
          ],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      host: process.env.HOST,
      port: process.env.PORT,
      stats: 'errors-only',
    },
  });
}

if (TARGET === 'gh-pages' || TARGET === 'gh-pages:stats') {
  module.exports = merge(common, siteCommon, {
    entry: {
      app: config.paths.docs,
      vendors: [
        'react',
        'react-dom',
      ],
    },
    output: {
      path: './gh-pages',
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js',
    },
    plugins: [
      new CleanWebpackPlugin(['gh-pages'], {
        verbose: false,
      }),
      new ExtractTextPlugin('[name].[chunkhash].css'),
      new webpack.DefinePlugin({
          // This affects the react lib size
        'process.env.NODE_ENV': '"production"',
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.CommonsChunkPlugin(
        'vendor',
        '[name].[chunkhash].js',
      ),
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
        },
        {
          test: /\.jsx?$/,
          loaders: ['babel'],
          include: [
            config.paths.docs,
            config.paths.src,
          ],
        },
      ],
    },
  });
}

const distCommon = {
  resolve: {
    root: config.paths.src,
    extensions: ['', '.js', '.jsx', '.css', '.png', '.jpg'],
  },
  devtool: 'source-map',
  output: {
    path: config.paths.dist,
    libraryTarget: 'umd',
    library: config.library,
  },
  entry: config.paths.src,
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'react',
    },
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: config.paths.src,
      },
    ],
  },
  plugins: [
    new SystemBellPlugin(),
  ],
};

if (TARGET === 'dist' || TARGET === 'dev') {
  module.exports = merge(distCommon, {
    output: {
      filename: `${config.filename}.js`,
    },
  });
}

if (TARGET === 'dist:min') {
  module.exports = merge(distCommon, {
    output: {
      filename: `${config.filename}.min.js`,
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ],
  });
}

if (!TARGET) {
  module.exports = common;
}
