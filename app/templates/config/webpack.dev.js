const merge = require('webpack-merge');
const utils = require('./utils.js');
const webpack = require('webpack');
const common = require('./webpack.common.js');
let config = merge(common, {
    mode: 'development',
    devtool: 'eval',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                        options: {
                            modules: true,
                            localIdentName: '[name][hash]',
                            getLocalIdent: (context, localIdentName, localName, options) => {
                                let resourcePath = context.resourcePath;
                                let componentName = resourcePath.split('/').slice(-2, -1);
                                componentName = utils.camelSplit(componentName[0]);
                                return `${componentName}-${localName}`;
                            }
                        }
                    }, {
                        loader: 'less-loader', // compiles Less to CSS
                    }]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    }
                ]
            }
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]   
});
module.exports = config;
