const {BaseController} = require("../../../index");

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
}
