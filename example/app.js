const express = require('express');

const app = express();

const {router} = require('../index')

app.use('/demo', router({
  path: './example/controller'
}))

app.get('/demo1', (req, res) => {
  res.json({
    msg: 'hello'
  })
})

const route = express.Router();

route.get('/demo2', (req, res) => {
  res.json({
    msg: 'hello'
  })
})

app.use(route);

app.listen(3000);