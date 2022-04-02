/**
 *
 * renderTemplate.js
 * @author wangbo
 * @since 2022/3/24
 */
const MetalSmith = require('metalsmith'); // 遍历文件夹 找需不需要渲染
const {render} = require('consolidate').ejs; // 统一所有的模板引擎
const {promisify} = require('util');
const path = require("path");
const inquirer = require('inquirer');
const renderPro = promisify(render);
const fs = require('fs-extra');

module.exports = async function renderTemplate(result, projectName) {
    if (!result) {
        return Promise.reject(new Error(`无效的source：${result}`))
    }

    // 判断是否存在ask.js文件
    if(!fs.existsSync(path.join(result, 'ask.js'))) {
        console.error('SomeThing was wrong！');
        return ;
    }

    await new Promise((resolve, reject) => {
        MetalSmith(__dirname)
            .clean(false)
            .source(result)
            .destination(path.resolve(projectName))
            .use(async (files, metal, done) => {
                const a = require(path.join(result, 'ask.js'));
                const r = await inquirer.prompt(a);
                const m = metal.metadata();
                const tmp = {
                    ...r,
                    name: projectName.trim().toLocaleLowerCase()
                }
                Object.assign(m, tmp);
                if (files['ask.js']) {
                    delete files['ask.js'];
                    await fs.removeSync(result);
                }
                done()
            })
            .use((files, metal, done) => {
                const meta = metal.metadata();
                const fileTypeList = ['.ts', '.js', '.json'];
                Object.keys(files).forEach(async (file) => {
                    let c = files[file].contents.toString();
                    for (const type of fileTypeList) {
                        if (file.includes(type) && c.includes('<%')) {
                            c = await renderPro(c, meta);
                            files[file].contents = Buffer.from(c);
                        }
                    }
                });
                done()
            })
            .build((err) => {
                err ? reject(err) : resolve({resolve, projectName});
            })
    });
};
