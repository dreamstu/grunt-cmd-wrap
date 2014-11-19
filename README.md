# grunt-cmd-wrap

  > run [cmd-wrap](https://github.com/crossjs/cmd-wrap) with grunt.

## 用法

```js
grunt.initConfig({
  'cmd-wrap': {
    proxy: {
      // target folder relative to `process.cwd()`
      dest: '',
      // server listening port
      port: 8000,
      // url prefix to be trimed
      pref: '/static'
    }
  }
});
```
