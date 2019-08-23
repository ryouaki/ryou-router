const express = require('express');

const app = express();

const {router} = require('../index')

app.use('/demo', router({
  path: './example/controller'
}))

app.listen(3000);