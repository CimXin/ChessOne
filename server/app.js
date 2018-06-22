var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

app.get('/hello', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log("message -> ",msg);
    ws.send(msg);
  });
  ws.on("close",()=>{
    console.log("closed");
  })
  console.log('socket', req.testing);
});

app.listen(3000);