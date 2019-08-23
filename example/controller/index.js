const {BaseController} = require("../../index");

module.exports = class Test extends BaseController {
  before(req, res) {
    console.log("Request come in!" + req.originalUrl)
  }

  after(req, res) {
    console.log("Response come out!" + req.originalUrl)
  }
  get$test1(req, res) {
    res.status(200).json({
      code: 0,
      data: null,
      msg: req.params.id
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
      msg: this.req.params.id
    }
  }

  'get /test4' () {
    this.success(null, "test");
  }

  'get /test5/:msg' () {
    this.failed(400, this.req.params.msg, "test");
  }

  'get /session/test' () {
    if (this.req.session.views) {
      this.req.session.views++
    } else {
      this.req.session.views = 1
    }
    this.success(this.req.session, "test");
  }
}
