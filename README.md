[![NPM version](https://badge.fury.io/js/grunt-cmd-wrap.png)](http://badge.fury.io/js/grunt-cmd-wrap)

[![NPM](https://nodei.co/npm/grunt-cmd-wrap.png?downloads=true)](https://nodei.co/npm/grunt-cmd-wrap/)

# grunt-cmd-wrap

  > A Grunt task plugin to transport `CommonJS` module to `CMD` module for `SeaJS` environment dynamically.

  > Grunt 插件：通过 Web 服务实时地将 CommonJS 模块转化成 CMD 模块，方便 SeaJS 环境中的开发调试。

## 背景

- [SPM](https://github.com/spmjs/spm) 版本从 2 升级到 3，遵循的规范从 CMD 转为 CommonJS；
- 前端开发调试过程中需要对 CommonJS 模块动态 Wrapping；
- 纯前端的解决方案 [seajs-wrap](https://github.com/seajs/seajs-wrap) 存在不少弊端。

## 用法

```bash
$ npm install --save-dev grunt-cmd-wrap
```

```js
grunt.initConfig({
  wrap: {
    server: {
      // base directory
      base: '.',
      // server listening port
      port: 8080,
      // files to be wrapped
      wrap: function(url) {
        return /^\/(app|mod|spm_modules).+\.js$/.test(url);
      }
    }
  }
});
```
