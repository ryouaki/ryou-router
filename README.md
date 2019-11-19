
[![npm downloads](https://img.shields.io/npm/dm/ryou-router.svg?style=flat-square)](http://npm-stat.com/charts.html?package=ryou-router)

# ryou-router
The router plugin for expressjs about auto configure the routing function. 自动配置Expressjs路由插件

## API

```js
  const { router, BaseController } = require('ryou-router');

  // the params is optional
  app.use('/prefix', router({
    path: 'the path for your controller' // default value is `${process.cwd()}/controller`
  }))

  module.exports = class Api1 extends BaseController {
    `get /method/:id` (req, res) {
      return "ok";
    }
  }
```

## Controller

Each controller means a routing function, just like below：
```js
  get [prefix path]/[controller class name]/[method name]
```
E.X.: get /api/v1/webapi/test/test1

controller rules：
1. {HTTPMethod}$[path]1}${path2}${_PARAM1}
2. {HTTPMethod path}

```js
  const { BaseController } = require("ryou-router"); // 所有controller 必须继承自baseController

  module.exports = class Test extends BaseController {

    // 可写可不写
    constructor() {
      super();
    }

    // 在所有该模块的请求被处理前执行
    before(req, res) {
      console.log("Request come in!" + req.originalUrl)
    }

    // 在所有请求返回后执行
    after(req, res) {
      console.log("Response come out!" + req.originalUrl)
    }

    // 提供两种接口实现方式，可以自己像平时一样操作req，res
    get$test1(req, res) {
      res.status(200).json({
        code: 0,
        data: null,
        msg: req.query.id
      })
    }

    // 也可以直接返回一个对象，这里必须是对象，可以通过this.req,this.res访问请求的上下文req, res
    get$test2$_id() {
      return {
        code: 0,
        data: null,
        msg: this.req.params.id
      }
    }

    // 也可以通过如下方式定义相应函数，'方法 /路径1/路径2/:id'，参考http协议头
    'get /test3/:id' () {
      return {
        code: 0,
        data: null,
        msg: this.req.params.id
      }
    }

    // 内置success和failed方法，其中failed方法第四个参数是返回的httpStatusCode，默认400
    'get /test4' () {
      this.success(null, "test");
    }

    'get /test5/:msg' () {
      this.failed(400, this.req.params.msg, "test");
    }

    // 返回字符串
    'get /test6' () {
      return 'hello world';
    }

    // 返回文件流
    'get /test7' () {
      return fs.createReadStream('test.file');
    }

    // session test
    'get /session/test' () {
      if (this.req.session.views) {
        this.req.session.views++
      } else {
        this.req.session.views = 1
      }
      this.success(this.req.session, "test");
    }

    // 修改http code
    'get /test8' () {
      this.status = 404
      return 'hello 404';
    }

    // 修改返回content-type
    'get /test9' () {
      this.type = 'application/html';
      return 'hello 404';
    }
  }
```

## Demo

[Demo](/example/app.js)

## Changelog

### 2019/11/19
- 新增：支持返回流对象，Buffer对象，字符串
- 新增：支持自定义返回httpstatus code
- 新增：支持自定义content-type
- 修复：偶尔出现的headersent警告
- 修复：性能提升10%+
- 废弃：success，failed接口（目前依然可用，但是已经增加在开发模式下的警告）
