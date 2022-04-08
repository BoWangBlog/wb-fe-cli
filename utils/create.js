/**
 * 新建项目
 * create.js
 * @author wangbo
 * @since 2022/3/22
 */

const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const boxen = require("boxen");
const renderTemplate = require("./renderTemplate");
const downloadTemplate = require('./download');
const install = require('./install');
const setRegistry = require('./setRegistry');
const {baseUrl, promptList} = require('./constants');

const downloadSuccessfully = (projectName) => {
    const END_MSG = `${chalk.blue("🎉 created project " + chalk.greenBright(projectName) + " Successfully")}\n\n 🙏 Thanks for using wb-cli !`;
    const BOXEN_CONFIG = {
        padding: 1,
        margin: {top: 1, bottom: 1},
        borderColor: 'cyan',
        align: 'center',
        borderStyle: 'double',
        title: '🚀 Congratulations',
        titleAlignment: 'center'
    }

    const showEndMessage = () => process.stdout.write(boxen(END_MSG, BOXEN_CONFIG))
    showEndMessage();

    console.log('👉 Get started with the following commands:');
    console.log(`\n\r\r cd ${chalk.cyan(projectName)}`);
    console.log("\r\r npm install");
    console.log("\r\r npm run start \r\n");
}

const go = (downloadPath, projectRoot) => {
    return downloadTemplate(downloadPath, projectRoot).then(target => {//下载模版
        return {
            projectRoot,
            downloadTemp: target
        }
    })
}
module.exports = async function create(projectName) {
    // 校验项目名称合法性
    const pattern = /^[a-zA-Z0-9]*$/;
    if (!pattern.test(projectName.trim())) {
        console.log(`\n${chalk.redBright('You need to provide a projectName, and projectName type must be string or number!\n')}`);
        return;
    }

    inquirer.prompt(promptList).then(async answers => {
        const destDir = path.join(process.cwd(), projectName);
        // 由于git项目文件名称的限制，这里需要转换一下移动端的名称
        // 下载地址
        const downloadPath = `direct:${baseUrl}/${answers.type}-${answers.frame}-template.git#master`
        // 创建文件夹
        fs.mkdir(destDir, {recursive: true}, (err) => {
            if (err) throw err;
        });

        console.log(`\nYou select project template url is ${downloadPath} \n`);

        const data = await go(downloadPath, destDir);

        await renderTemplate(data.projectRoot, projectName);

        const {isInstall, installTool} = await inquirer.prompt([
            {
                name: "isInstall",
                type: "confirm",
                default: "No",
                message: "Would you like to help you install dependencies?",
                choices: [
                    {name: "Yes", value: true},
                    {name: "No", value: false}
                ]
            },
            {
                name: "installTool",
                type: "list",
                default: "npm",
                message: 'Which package manager you want to use for the project?',
                choices: ["npm", "cnpm", "yarn"],
                when: function (answers) {
                    return answers.isInstall;
                }
            }
        ]);
        if (isInstall) {
            await install({projectName, installTool});
        }

        // 是否设置了仓库地址
        if (answers.setRegistry) {
            setRegistry(projectName, answers.gitRemote);
        }

        downloadSuccessfully(projectName);
    });
}