const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

const SOURCE_DIR = 'src';
const DIST_DIR = 'dist';

module.exports = (env) => {
  const pluginJson = require(path.resolve(process.cwd(), `${SOURCE_DIR}/plugin.json`));
  const isDev = env.development === true;

  return {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : 'source-map',
    context: path.resolve(process.cwd(), SOURCE_DIR),
    entry: {
      module: './module.ts',
    },
    output: {
      path: path.resolve(process.cwd(), DIST_DIR),
      filename: '[name].js',
      library: {
        type: 'amd',
      },
      publicPath: `public/plugins/${pluginJson.id}/`,
      uniqueName: pluginJson.id,
    },
    externals: [
      'lodash',
      'react',
      'react-dom',
      '@grafana/data',
      '@grafana/runtime',
      '@grafana/ui',
      '@emotion/css',
      function ({ request }, callback) {
        const prefix = 'grafana/';
        if (request && request.startsWith(prefix)) {
          return callback(null, request.slice(prefix.length));
        }
        callback();
      },
    ],
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: '../README.md', to: '.', noErrorOnMissing: true },
          { from: 'plugin.json', to: '.' },
          { from: 'img/**/*', to: '.', noErrorOnMissing: true },
        ],
      }),
      new ForkTsCheckerWebpackPlugin({
        async: isDev,
        typescript: {
          configFile: path.resolve(process.cwd(), 'tsconfig.json'),
          memoryLimit: 4096,
        },
      }),
      new ESLintPlugin({
        extensions: ['ts', 'tsx'],
        lintDirtyModulesOnly: isDev,
        failOnError: false,
      }),
      ...(isDev
        ? []
        : [
            new ReplaceInFileWebpackPlugin([
              {
                dir: DIST_DIR,
                files: ['plugin.json'],
                rules: [
                  {
                    search: '%VERSION%',
                    replace: pluginJson.info.version,
                  },
                  {
                    search: '%TODAY%',
                    replace: new Date().toISOString().slice(0, 10),
                  },
                ],
              },
            ]),
          ]),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      unsafeCache: true,
    },
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  decorators: true,
                  dynamicImport: true,
                },
                target: 'es2021',
                loose: false,
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
      ],
    },
  };
};

