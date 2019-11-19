const express = require("express");
const path = require('path');
const fs = require('fs');
const Stream = require('stream');

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

const router = express.Router();

router.__proto__.attch = function (controller) {
  const props = controller.__$$getProps();
  const methods = controller.__$$getMethods();

  const subRouter = express.Router();

  methods.forEach(method => {
    let items = method.split("$");
    let strMethod = false;
    let action = null;

    if (items.length <= 1) {
      strMethod = true;
      items = method.split(" ");
    }

    action = items[0].toLowerCase();

    if ([
      'get', 
      'post', 
      'delete', 
      'put', 
      'update', 
      'options', 
      'patch', 
      'head'
    ].indexOf(action) >= 0) {
      let path = "";
      if (!strMethod) {
        for (let i = 1; i < items.length; i++) {
          path += `/${items[i].replace('_', ':')}`
        }
      } else {
        path = items[1];
      }
      
      subRouter[action](path, async function (req, res) { 
        const ctx = Object.create({});
        ctx.req = req;
        ctx.res = res;
        ctx.query = req.query;
        ctx.params = req.params;
        ctx.status = 200;
        ctx.type = null;

        ctx.success = controller.success;
        ctx.failed = controller.failed;

        controller.before.call(ctx, req, res);
        const data = controller[method].call(ctx, req, res);
        let ret = null;
        if (isPromise(data)) {
          ret = await data;
        } else {
          ret = data;
        }
        controller.after.call(ctx, req, res);
        if (!res.finished || ret) {
          ctx.type && res.type(ctx.type);
          res.status(ctx.status);
          if (Buffer.isBuffer(ret)) {
            res.end(ret);
          } else if ('string' == typeof ret) {
            res.end(ret);
          } else if (ret instanceof Stream) {
            ret.pipe(res);
          } else {
            res.json(ret);
          }
        }
      });
    }
  });

  router.use(`/${props.name.toLowerCase()}`, subRouter);
}

exports.router = function (opts = {}) {
  const controllerPath = opts.path || path.resolve(process.cwd(), 'controller');

  const files = fs.readdirSync(controllerPath);

  files.forEach((file) => {
    const stat = fs.lstatSync(`${controllerPath}/${file}`);
    if (stat.isFile()) {
      const Controller = require(`${controllerPath}/${file}`);
      router.attch(new Controller());
    }
  });

  return router;
};

class BaseController {
  constructor(prefix) {
    this.prefix = prefix;
    this.name = this.constructor.name;
  }

  before(req, res) {

  }

  after(req, res) {
    
  }

  success(data, msg) {
    if (process.env.NODE_ENV != 'production') {
      console.warn('【Warning】: method "success" will be remove after v2.0!')
    }
    this.res.status(this.status).json({
      code: 0,
      data: data,
      msg: msg
    }).end();
  }

  failed(code, data, msg) {
    if (process.env.NODE_ENV != 'production') {
      console.warn('【Warning】: method "failed" will be remove after v2.0!')
    }
    this.res.status(this.status).json({
      code: code,
      data: data,
      msg: msg
    }).end();
  }
}

BaseController.prototype.__$$getProps = function () {
  return {
    name: this.name
  }
}

BaseController.prototype.__$$getMethods = function () {
  const props = Object.getOwnPropertyNames(this.__proto__);
  return props.filter((prop) => {
    return prop !== "constructor" && typeof this[prop] === "function";
  });
}

exports.BaseController = BaseController;