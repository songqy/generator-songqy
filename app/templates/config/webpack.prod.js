/*
 * @Description: file content
 * @Author: RongWei
 * @Date: 2019-08-02 14:28:03
 * @LastEditors: RongWei
 * @LastEditTime: 2019-08-23 11:24:02
 */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const incstr = require('incstr');
const utils = require('./utils.js');
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const createUniqueIdGenerator = () => {
    const index = {};

    const generateNextId = incstr.idGenerator({
        // Removed "d" letter to avoid accidental "ad" construct.
        // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
        alphabet: 'abcefghijklmnopqrstuvwxyz0123456789'
    });

    return (name) => {
        if (index[name]) {
            return index[name];
        }

        let nextId;

        do {
            // Class name cannot start with a number.
            nextId = generateNextId();
        } while (/^[0-9]/.test(nextId));

        index[name] = generateNextId();

        return index[name];
    };
};
// const uniqueIdGenerator = createUniqueIdGenerator();
let cdnHeader = 'dt-cdn';
if (process.env.UAT) {
    if (process.env.UAT3) cdnHeader = 'dt-uat3-cdn';
    else if (process.env.UAT2) cdnHeader = 'dt-uat2-cdn';
    else cdnHeader = 'dt-uat-cdn';
}
module.exports = merge(common, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    output: {
        publicPath: `https://${cdnHeader}.maycur.com/formrender/`
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false // set to true if you want JS source maps
            }),
            // new OptimizeCSSAssetsPlugin({
            //     cssProcessorOptions: { discardComments: { removeAll: true } },
            //     canPrint: false
            // })
        ],
        splitChunks: {
            maxAsyncRequests: 5,
            cacheGroups: {
                // Don't generate automatic common chunks
                // default: false,
                // Don't generate automatic vendor chunks
                vendors: false,
                // Custom common chunk
                bundle: {
                    test: /node_modules/,
                    name: 'common',
                    chunks: 'async',
                    minChunks: 2,
                    reuseExistingChunk: true,
                },
                // Merge all the CSS into one file
                styles: {
                    name: 'mkstyles',
                    test: /\.(less|css)$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(less)$/,
                use: [MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader', // translates CSS into CommonJS
                    options: {
                        modules: true,
                        localIdentName: '[local]__[hash:base64:6]',
                        getLocalIdent: (context, localIdentName, localName, options) => {
                            let resourcePath = context.resourcePath;
                            let componentName = resourcePath.split('/').slice(-2, -1);
                            componentName = utils.camelSplit(componentName[0]);
                            return componentName + '-' + localName;
                        }
                    }
                }, {
                    loader: 'less-loader', // compiles Less to CSS
                }
                ]
            },
            {
                test: /\.(css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        })
    ]
});
