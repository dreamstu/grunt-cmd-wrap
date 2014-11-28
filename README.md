# grunt-cmd-wrap

  > A Grunt task plugin to transport `CommonJS` module to `CMD` module for `SeaJS` environment dynamically.

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
