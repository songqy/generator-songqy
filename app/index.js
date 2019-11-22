'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const config = require('./config');

module.exports = class extends Generator {
    prompting() {
        // Have Yeoman greet the user.
        this.log(
            yosay(`Welcome to the legendary ${chalk.red('generator-maycur')} generator!`),
        );

        return this.prompt(config.prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.props = props;

        });
    }

    writing() {
        const templateData = {
            appname: this.props.appname,
        };

        const copy = (input, output) => {
            this.fs.copy(this.templatePath(input), this.destinationPath(output));
        };

        const copyTpl = (input, output, data) => {
            this.fs.copyTpl(
                this.templatePath(input),
                this.destinationPath(output),
                data,
            );
        };

        config.filesToCopy.forEach(file => {
            copy(file.input, file.output);
        });

        config.filesToRender.forEach(file => {
            copyTpl(file.input, file.output, templateData);
        });
    }

    install() {
        this.installDependencies();
    }
};
