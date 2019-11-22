const webpackDevServer = require('webpack-dev-server');
const Webpack = require('webpack');
const openBrowser = require('./openBrowser');
const devConfig = require('./webpack.dev.js');
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.on('unhandledRejection', err => {
    throw err;
});

let serveConfig = {
    hot: true,
    port: 8111,
    host: 'localhost',
    proxy: {
        '/angular': {
            target: 'http://localhost:8100',
            pathRewrite: { "^/angular": "" },
            secure: false,
            changeOrigin: true,
        },
        '/web/report': {
            // target: 'https://dingding.maycur.com',            
            /* report本地调试的路由机制，前缀不是web/report,正式库的路由是有前缀web/report */
            target: 'http://localhost:8080',
            pathRewrite: { "^/web/report": "" },
            secure: false,
            changeOrigin: true,
        },
        '/admin': {
            target: 'http://localhost:8010',
            pathRewrite: { "^/admin": "" },
            secure: false,
            changeOrigin: true
        }
    }
}
webpackDevServer.addDevServerEntrypoints(devConfig, serveConfig);
const compiler = Webpack(devConfig);
const server = new webpackDevServer(compiler, serveConfig);

server.listen(serveConfig.port, serveConfig.host, () => {
    console.log(`Starting server http://localhost:${serveConfig.port}/`);
    openBrowser(`http://localhost:${serveConfig.port}/`);
});
