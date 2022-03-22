/**
 *
 * create.js
 * @author wangbo
 * @since 2022/3/22
 */

const inquirer = require("inquirer");
const ora = require("ora");
const chalk = require("chalk");
const download = require("download-git-repo");
const figlet = require("figlet");
const install = require("./install");
const fs = require("fs-extra");
const handlebars = require("handlebars");
const choicesList = [
    {
        name: 'buildTool',
        message: 'Which packaging tool to use for the project?',
        type: 'list',
        choices: ['webpack', 'vite'],
    },
    {
        name: 'description',
        message: 'please enter project description:',
    },
    {
        name: 'author',
        message: 'please enter project author:',
    }
];

module.exports = async function create(projectName, options) {

    inquirer.prompt(choicesList).then((answers) => {
        const spinner = ora(chalk.greenBright('downloading template, wait a moment...'));
        console.log();
        spinner.start();

        const downloadPath = `direct:https://github.com/BoWangBlog/${answers.buildTool}-react-template.git#master`

        download(downloadPath, projectName, {clone: true}, (err) => {
            // 下载错误
            if (err) {
                spinner.fail();
                console.error(chalk.red(`${err}download template failed, please check your network connection and try again`))
                process.exit(1);
            }
            spinner.succeed();

            // 安装依赖
            console.log();
            console.log(chalk.blackBright('Waiting, installing dependencies...'));
            console.log();

            install({ cwd: projectName}).then(() => {
                const meta = {
                    name: projectName,
                    description: answers.description,
                    author: answers.author,
                }
                const fileName = `${projectName}/package.json`;
                const content = fs.readFileSync(fileName).toString();
                const result = handlebars.compile(content)(meta);
                fs.writeFileSync(fileName, result);
                console.log(figlet.textSync("Successfully", {
                    font: "Epic",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 100,
                    whitespaceBreak: true,
                }));
                console.log();
                console.log(chalk.blue(`Congratulations, ${projectName} created successfully!!!`));
                console.log(`\r\n  cd ${chalk.cyan(projectName)}`);
                console.log("  npm install\r\n");
                console.log("  npm run start\r\n");
            });
        });
    });
}