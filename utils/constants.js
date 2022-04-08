/**
 * constants.js
 * @author wangbo
 * @since 2022/3/25
 */

const { version } = require('../package.json');

const baseUrl = 'https://github.com/BoWangBlog';
const promptList = [
    {
        name: 'type',
        message: 'Which build tool to use for the project?',
        type: 'list',
        default: 'webpack',
        choices: ['webpack', 'vite'],
    },
    {
        name: 'frame',
        message: 'Which framework to use for the project?',
        type: 'list',
        default: 'react',
        choices: ['react', 'vue'],
    },
    {
        name: 'setRegistry',
        message: "Would you like to help you set registry remote?",
        type: 'confirm',
        default: false,
        choices: [
            {name: "Yes", value: true},
            {name: "No", value: false}
        ]
    },
    {
        name: 'gitRemote',
        message: 'Input git registry for the project: ',
        type: 'input',
        when: (answers) => {
            return answers.setRegistry;
        },
        validate: function (input) {
            const done = this.async();
            setTimeout(function () {
                // 校验是否为空，是否是字符串
                if (!input.trim()) {
                    done('You should provide a git remote url');
                    return;
                }
                const pattern = /^(http(s)?:\/\/([^\/]+?\/){2}|git@[^:]+:[^\/]+?\/).*?.git$/;
                if (!pattern.test(input.trim())) {
                    done(
                        'The git remote url is validate',
                    );
                    return;
                }
                done(null, true);
            }, 500);
        },
    }
];

module.exports = {
    version,
    baseUrl,
    promptList
}