var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var gameController = require("./game-controller");
var game_controler = new gameController();

// app.use(function (req, res, next) {
//   console.log('middleware');
//   req.testing = 'testing';
//   return next();
// });

app.ws('/', function (ws, req) {
  // console.error(expressWs, "------------\n", ws);
  ws.on('message', function (msg) {
    console.error("message -> ", msg, req.originalUrl);
    // ws.send(msg);
    game_controler.listener(ws, msg);
  });
  ws.on("close", () => {
    console.log("closed");
  })
  console.log('socket', req.testing);
});

app.ws("/login", function (ws, req) {
  ws.on("message", function (msg) {
    console.error("message -> ", msg, req.originalUrl);
    ws.send(JSON.stringify({
      msg: "login success"
    }));
  });
  ws.on("close", function (msg) {
    console.log("login close");
  });
  console.log('socket login', req.testing);
});

app.ws("/test", function (ws, req) {
  ws.on("message", function (msg) {
    ws.send(JSON.stringify({
      msg: "login test"
    }));
  });

  ws.on("close", function (msg) {
    console.log("test close");
  });
});

// setInterval(function () {
//   var aWss = expressWs.getWss("/login");
//   console.error("bort", aWss.clients.size)
//   aWss.clients.forEach(function (client) {
//     console.error(client.upgradeReq);
//     // if(client.upgradeReq)
//     var data = {
//       code: "test"
//     }
//     client.send(JSON.stringify(data));
//   });
// }, 3000);

app.listen(3000);