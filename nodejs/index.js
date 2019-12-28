const http = require('http');

const server = http.createServer((req, res) => {
  res.write('Hello world')
  res.end();
});

server.listen(3000);

// // 7400 - 9600	10-16ms