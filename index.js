const express = require("express");
const path = require('path');
const fs = require('fs');

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

const router = express.Router();

router.__proto__.attch = function (controller) {
  const props = controller.getProps();
  const methods = controller.getMethods();

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

    if (['get', 'post', 'delete', 
      'put', 'update', 'options', 
      'patch', 'head'].indexOf(action) >= 0) {
        let path = "";
        if (!strMethod) {
          for (let i = 1; i < items.length; i++) {
            path += `/${items[i].replace('_', ':')}`
          }
        } else {
          path = items[1];
        }
        
        subRouter[action](path, async function (req, res, next) { 
          controller.updateContext(req, res);
          controller.before(req, res);
          const data = controller[method](req, res);
          let ret = null;
          if (isPromise(data)) {
            ret = await data;
          } else {
            ret = data;
          }
          controller.after(req, res);
          if (!res.headersSent && ret) {
            res.json(ret).end();
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

exports.BaseController = class BaseController {
  constructor(prefix) {
    this.name = this.constructor.name;
  }

  updateContext(req, res) {
    this.req = req;
    this.res = res;

    this.params = req.params;
    this.query = req.query;
  }

  before(req, res) {

  }

  after(req, res) {
    
  }

  success(data, msg) {
    this.res.status(200).json({
      code: 0,
      data: data,
      msg: msg
    }).end();
  }

  failed(code, data, msg, httpStatus = 400) {
    this.res.status(httpStatus).json({
      code: code,
      data: data,
      msg: msg
    }).end();
  }

  getProps() {
    return {
      name: this.name
    }
  }

  getMethods() {
    const props = Object.getOwnPropertyNames(this.__proto__);
    return props.filter((prop) => {
      return prop !== "constructor" && typeof this[prop] === "function";
    });
  }
}
