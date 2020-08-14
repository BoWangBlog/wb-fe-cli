#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const chalk = require('chalk');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const ora = require('ora');
const symbols = require('log-symbols');
const handlebars = require('handlebars');
const install = require('./utils/index');

program.version(require('./package').version, '-v, --version')
    .command('init <name>')
    .action((name) => {
        if (!fs.existsSync(name)) {
            inquirer.prompt([
                {
                    name: 'buildTool',
                    message: 'Which packaging tool to use for the project?',
                    type: 'list',
                    choices: ['webpack', 'parcel', 'vite'],
                },
                {
                    name: 'description',
                    message: 'please enter project description:',
                },
                {
                    name: 'author',
                    message: 'please enter project author:',
                }
            ]).then((answers) => {
                // start to download
                const spinner = ora(chalk.greenBright('downloading template, wait a moment...'));
                console.log();

                spinner.start();
                const downloadPath = `direct:https://github.com/webbx/${answers.buildTool}-react-template.git#master`
                download(downloadPath, name, {clone: true}, (err) => {
                    // 下载错误
                    if (err) {
                        spinner.fail();
                        console.error(symbols.error, chalk.red(`${err}download template failed, please check your network connection and try again`))
                        process.exit(1);
                    }
                    spinner.succeed();

                    // 安装依赖
                    console.log();
                    console.log(chalk.blackBright('Waiting, installing dependencies...'));
                    console.log();

                    install({ cwd: name}).then(() => {
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author,
                        }
                        const fileName = `${name}/package.json`;
                        const content = fs.readFileSync(fileName).toString();
                        const result = handlebars.compile(content)(meta);
                        fs.writeFileSync(fileName, result)

                        console.log(chalk.blue(`Congratulations, ${name} created successfully!!!`));
                        console.log();
                    });
                })
            })
        } else {
            // 错误提示项目已存在，避免覆盖原有项目
            console.error(symbols.error, chalk.red('project already exist!!!'))
        }
    }).on('--help', () => {
    console.log('  Examples:')
    console.log('    $ w init index')
    console.log()
})

program.parse(process.argv)
