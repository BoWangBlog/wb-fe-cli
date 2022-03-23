/**
 * 检查更新
 * checkUpdate.js
 * @author wangbo
 * @since 2022/3/23
 */
const pkg = require('../package.json');
const shell = require('shelljs');
const semver = require('semver');
const chalk = require('chalk');
const inquirer = require("inquirer");
const ora = require("ora");

const updateNewVersion = (remoteVersionStr) => {
    const spinner = ora(chalk.blackBright('The cli is updating, wait a moment...'));
    spinner.start();
    const shellScript = shell.exec("npm -g install wb-fe-cli");
    if (!shellScript.code) {
        spinner.succeed(chalk.green(`Update Successfully, now your local version is latestVersion: ${remoteVersionStr}`));
        return;
    }
    spinner.stop();
    console.log(chalk.red('\n\r Failed to install the cli latest version, Please check your network or vpn'));
};

module.exports = async function checkUpdate() {
    const localVersion = pkg.version;
    const pkgName = pkg.name;
    const remoteVersionStr = shell.exec(
        `npm info ${pkgName}@latest version`,
        {
            silent: true,
        }
    ).stdout;

    if (!remoteVersionStr) {
        console.log(chalk.red('Failed to get the cli version, Please check your network or vpn'));
        process.exit(1);
    }
    const remoteVersion = semver.clean(remoteVersionStr, null);

    if (remoteVersion !== localVersion) {
        // 检测本地安装版本是否是最新版本，如果不是则询问是否自动更新
        console.log(`Latest version is ${chalk.greenBright(remoteVersion)}, Local version is ${chalk.blackBright(localVersion)} \n\r`)

        const {isUpdate} = await inquirer.prompt([
            {
                name: "isUpdate",
                type: "confirm",
                message: "Would you like to update it?",
                choices: [
                    {name: "Yes", value: true},
                    {name: "No", value: false}
                ]
            }
        ]);
        if (isUpdate) {
            updateNewVersion(remoteVersionStr);
        } else {
            console.log();
            console.log(`Ok, you can run ${chalk.greenBright('wb-cli update')} command to update latest version in the feature`);
        }
        return;
    }
    console.info(chalk.green("Great! Your local version is latest!"));
};