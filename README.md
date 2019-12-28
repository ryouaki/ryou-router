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

Support directory path for router uri.
```js
  // for example we have a controller class named Api1 and has a method named test
  |-- controller
     |-- module
        |-- Api.js  // url is http://host:port/module/api/test
     |-- Api.js // url is http://host:port/api/test
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
        msg: req.params.id
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
    'get /test3' () {
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
  }
```

## Demo

[Demo](/example/app.js)