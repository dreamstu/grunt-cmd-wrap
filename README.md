# grunt-cmd-wrap

  > A Grunt task plugin to transport `CommonJS` module to `CMD` module for `SeaJS` environment dynamically.

## 背景

- [SPM](https://github.com/spmjs/spm) 版本从 2 升级到 3，遵循的规范从 CMD 转为 CommonJS；
- 前端开发调试过程中需要对 CommonJS 模块动态 Wrapping；
- 纯前端的解决方案 [seajs-wrap](https://github.com/seajs/seajs-wrap) 存在不少弊端。

## 用法

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
