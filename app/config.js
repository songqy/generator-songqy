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
            input: 'all-t.js',
            output: 'all-t.js',
        },
        {
            input: 'dummyfile.txt',
            output: 'dummyfile.txt',
        },
    ],
    filesToRender: [
        {
            input: '_package.json',
            output: 'package.json',
        },
    ],
};