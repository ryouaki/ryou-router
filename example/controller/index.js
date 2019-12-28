const {BaseController} = require("../../index");
const fs = require('fs')

module.exports = class Test extends BaseController {
  before(req, res) {
    console.log("Request come in!")
  }

  after(req, res) {
    console.log("Response come out!")
  }
  get$test1(req, res) {
    res.status(200).json({
      code: 0,
      data: null,
      msg: req.query.id
    })
  }

  get$test2$_id() {
    return {
      code: 0,
      data: null,
      msg: this.req.params.id
    }
  }

  'get /test3' () {
    return {
      code: 0,
      data: null,
      msg: this.req.query.id
    }
  }

  'get /test4' () {
    this.success(null, "test");
  }

  'get /test5/:msg' () {
    this.failed(400, this.req.params.msg, "test");
  }

  'get /test6' () {
    return 'hello world';
  }

  'get /test7' () {
    return fs.createReadStream('test.file');
  }

  'get /session/test' () {
    if (this.req.session.views) {
      this.req.session.views++
    } else {
      this.req.session.views = 1
    }
    this.success(this.req.session, "test");
  }

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
