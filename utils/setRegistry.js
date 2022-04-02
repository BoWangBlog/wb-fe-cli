/**
 * 设置仓库地址
 * setRegistry.js
 * @author wangbo
 * @since 2022/3/28
 */

const shell = require("shelljs");
const chalk = require("chalk");

module.exports = function setRegistry(projectName, gitRemote) {
    shell.cd(projectName);
    if (shell.exec('git init').code === 0) {
        if (shell.exec(`git remote add origin ${gitRemote}`).code === 0) {
            console.log(chalk.green(`✨ \n Set registry Successfully, now your local gitRemote is ${gitRemote} \n`));
            return;
        }
        console.log(chalk.red('Failed to set.'));
        shell.exit(1);
    }
};
