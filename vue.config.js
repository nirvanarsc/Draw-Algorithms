const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const srcDir = path.resolve(__dirname, 'src/main/ts');
const dstDir = path.resolve(__dirname, 'src/main/resources/static');

module.exports = {
  configureWebpack: {
    performance: {
      hints: false,
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: path.resolve(srcDir, 'public'),
        to: dstDir,
        toType: 'dir',
        ignore: [
          path.resolve(srcDir, 'public/index.html'),
        ],
      }]),
    ],
    resolve: {
      alias: {
        '@': srcDir,
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/css/_variables.scss";',
      },
    },
  },
  devServer: {
    port: 3000,
    proxy: {
      '/': {
        target: 'http://localhost:8080',
        ws: false,
      },
    },
  },
  outputDir: dstDir,
  pages: {
    app: {
      entry: path.resolve(srcDir, 'main.ts'),
      template: path.resolve(srcDir, 'public/index.html'),
      filename: 'index.html',
    },
  },
  runtimeCompiler: true,
};
