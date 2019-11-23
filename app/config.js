module.exports = {
    prompts: [
        {
            type: 'confirm',
            name: 'someAnswer',
            message: 'Would you like to enable this option?',
            default: true,
        },
        {
            type: 'input',
            name: 'appname',
            message: 'What is app name?',
        },
    ],
    filesToCopy: [
        {
            input: 'gitignore',
            output: '.gitignore',
        },
        {
            input: 'README.md',
            output: 'README.md',
        },
        {
            input: 'src/index.js',
            output: 'src/index.js',
        },
        {
            input: 'src/router/index.js',
            output: 'src/router/index.js',
        },
        {
            input: 'src/utils/axios.js',
            output: 'src/utils/axios.js',
        },
        {
            input: 'src/utils/middleTransformer.js',
            output: 'src/utils/middleTransformer.js',
        },
        {
            input: 'config/webpack.common.js',
            output: 'config/webpack.common.js',
        },
        {
            input: 'config/webpack.dev.js',
            output: 'config/webpack.dev.js',
        },
        {
            input: 'config/webpack.prod.js',
            output: 'config/webpack.prod.js',
        },
        {
            input: 'config/utils.js',
            output: 'config/utils.js',
        },
        {
            input: 'config/openBrowser.js',
            output: 'config/openBrowser.js',
        },
        {
            input: 'config/openPage.js',
            output: 'config/openPage.js',
        },
        {
            input: 'config/start.js',
            output: 'config/start.js',
        },
    ],
    filesToRender: [
        {
            input: '_package.json',
            output: 'package.json',
        },
    ],
    dirsToCreate: [
        'config',
        'src/models',
        'src/router',
        'src/routes',
        'src/utils',
        'src/services',
        'src/components',
        'src/assets',
        'public',
    ],
};