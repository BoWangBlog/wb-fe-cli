#! /usr/bin/env node

const {program} = require("commander");
const chalk = require("chalk");
const path = require("path");
const fs = require('fs-extra');
const figlet = require('figlet');
const create = require('./utils/create');
const checkUpdate = require('./utils/checkUpdate');

const inquirer = require("inquirer");
const ora = require("ora");

const pkgVersion = require('./package.json').version;

program.version(pkgVersion, "-v, --version");

program
    .command("init <project-name>")
    .description("create a new project name is <project-name>")
    .option("-f, --force", "overwrite target directory if it exists")
    .action(async (projectName, options) => {
        const cwd = process.cwd();
        // 拼接到目标文件夹
        const targetDirectory = path.join(cwd, projectName);
        // 如果目标文件夹已存在
        if (fs.existsSync(targetDirectory)) {
            if (!options.force) {
                console.error(chalk.red(`Project already exist! Please change your project name or use ${chalk.greenBright(`wb-cli create ${projectName} -f`)} to create`))
                return;
            }
            const {isOverWrite} = await inquirer.prompt([{
                name: "isOverWrite",
                type: "confirm",
                message: "Target directory already exists, Would you like to overwrite it?",
                choices: [
                    {name: "Yes", value: true},
                    {name: "No", value: false}
                ]
            }])
            if (isOverWrite) {
                const spinner = ora(chalk.blackBright('The project is Deleting, wait a moment...'));
                spinner.start();
                await fs.removeSync(targetDirectory);
                spinner.succeed();
                console.info(chalk.green("✨ Deleted Successfully, start init project..."));
                console.log();
                await create(projectName);
                return;
            }
            console.error(chalk.green("You cancel to create project"));
            return;
        }
        await create(projectName);
    });

program
    .command("update")
    .description("update the cli to latest version")
    .action(async () => {
        await checkUpdate();
    });

program.on("--help", () => {
    console.log(figlet.textSync("wb-cli", {
        font: "Standard",
        horizontalLayout: 'full',
        verticalLayout: 'fitted',
        width: 120,
        whitespaceBreak: true
    }));
});

program.parse(process.argv)
