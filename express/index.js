const express = require('express');
const app = express();

app.use((req, res) => {
  res.end('hello world');
})

app.listen(3000);

// 5300 - 6100	16-20ms