<h1 align="center">Welcome to wb-fe-cli 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/wb-fe-cli" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/wb-fe-cli.svg">
  </a>
  <img alt="npm" src="https://img.shields.io/npm/dt/wb-fe-cli"> 
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/wb-fe-cli">
  <a href="https://github.com/BoWangBlog/wb-fe-cli/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/BoWangBlog/wb-fe-cli"></a>
  <a href="https://github.com/BoWangBlog/wb-fe-cli/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/BoWangBlog/wb-fe-cli">
  </a> 
</p>

> a react project cli, help you create a react project with webpack or vite quickly

### 🏠 [Homepage](https://github.com/BoWangBlog/wb-fe-cli#readme)

## Pay attention to the following:

_**this is a React project cli, but not have template, you can create your own template by yourself use it;**_

**you need to change create.js downloadPath to your own template path**

```
const downloadPath = `direct:${baseUrl}/${answers.type}-${answers.frame}-template.git#master`
```

**in your template you need to set variables and add ask.ts file**
```javascript
module.exports = [
    {
        name: 'description',
        message: 'Please enter project description:',
    },
    {
        name: 'author',
        message: 'Please enter project author:',
    },
    {
        name: 'apiPrefix',
        message: 'Please enter project apiPrefix:',
        default: 'api/1.0',
        // @ts-ignore
        validate: function (input) {
            const done = this.async();
            setTimeout(function () {
                // 校验是否为空，是否是字符串
                if (!input.trim()) {
                    done('You can provide a apiPrefix, or not it will be default【api/1.0】');
                    return;
                }
                const pattern = /[a-zA-Z0-9]$/;
                if (!pattern.test(input.trim())) {
                    done(
                        'The apiPrefix is must end with letter or number, like default 【api/1.0】',
                    );
                    return;
                }
                done(null, true);
            }, 500);
        },
    },
    {
        name: 'proxy',
        message: 'Please enter project proxy:',
        default: 'https://www.test.com',
        // @ts-ignore
        validate: function (input) {
            const done = this.async();
            setTimeout(function () {
                // 校验是否为空，是否是字符串
                if (!input.trim()) {
                    done(
                        'You can provide a proxy, or not it will be default【https://www.test.com】',
                    );
                    return;
                }
                const pattern =
                    /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/;
                if (!pattern.test(input.trim())) {
                    done(
                        'The proxy is must end with letter or number, like default 【https://www.test.com】',
                    );
                    return;
                }
                done(null, true);
            }, 300);
        },
    },
];
```
## **Want to know more you can visit the source code !**

## Install

```sh
npm install
```

## Usage develop

```sh
npm link

wb-cli init [projectName]
```

## Usage

```shell script
npm install -g wb-fe-cli

wb-cli init [projectName] # init project
wb-cli update # update version
```

## Author

👤 **bo.wang**

* Website: https://blog.wangboweb.site
* Github: [@BoWang816](https://github.com/BoWang816)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/BoWangBlog/wb-fe-cli/issues). You can also take a look at the [contributing guide](https://github.com/BoWangBlog/wb-fe-cli/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [bo.wang](https://github.com/BoWang816).<br />
This project is [ISC](https://github.com/BoWangBlog/wb-fe-cli/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
