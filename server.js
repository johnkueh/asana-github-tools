var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('hello world');
});

app.listen({ port: 8000 }, () => {
  console.log('Node Server on http://localhost:8000');
});
