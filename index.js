#! /usr/bin/env node

const {program} = require("commander");
const chalk = require("chalk");
const fs = require('fs-extra');
const path = require("path");
const create = require('./utils/create');
const inquirer = require("inquirer");
const ora = require("ora");

const pkgVersion = require('./package.json').version;

program.version(pkgVersion);

program
    .command("create <project-name>")
    .description("create a new project name is <project-name>")
    .option("-f, --force", "overwrite target directory if it exists")
    .action(async (projectName, options) => {
        // 获取当前工作目录
        const cwd = process.cwd();
        // 拼接到目标文件夹
        const targetDirectory = path.join(cwd, projectName);
        // 如果目标文件夹已存在
        if (fs.existsSync(targetDirectory)) {
            // 判断是否使用-f强制新建
            if (!options.force) {
                // 未使用则提示已存在
                console.error(chalk.red(`Project already exist! Please change your project name or use ${chalk.cyan(`uni-cli create ${projectName} -f`)} to create`))
                return;
            }
            // 使用-f强制新建，则需要二次提示
            const {isOverWrite} = await inquirer.prompt([{
                name: "isOverWrite",
                type: "list",
                message: "Target directory already exists, Would you like to overwrite it?",
                choices: [
                    {name: "Yes, Overwrite", value: true},
                    {name: "No, Cancel", value: false}
                ]
            }])
            if (isOverWrite) {
                const spinner = ora(chalk.blackBright('The project is Deleting, wait a moment...'));
                spinner.start();
                await fs.removeSync(targetDirectory);
                spinner.succeed();
                await create(projectName, options);
                return;
            }
            console.error(chalk.green("You cancel to create project"));
            return;
        }
        await create(projectName, options, targetDirectory);
    });

program.on("--help", () => {
    console.log();
    console.log(
        `Run ${chalk.cyan("uni-cli <command> --help")} to get more information`
    );
    console.log();
});

program.parse(process.argv)
