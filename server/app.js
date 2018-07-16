'use strict';

var WebSocket = require("ws");
var MessageModel = require("./model/MessageModel");
var mysql = require("./utils/sql/mysql");
var config = require("./server-config");

mysql.init(config.mysqlConfig);

var wss = new WebSocket.Server({
    port: 3000
});

var count = 0;
wss.on("connection", function (ws, req) {
    ws.userId = count++;
    MessageModel.AddClient(ws);

    ws.on("message", function (message) {
        var view = new DataView(message.buffer);
        var protocol = view.getInt32(6);
        MessageModel.parse(protocol, message, ws.userId);
    });

    ws.on("close", function (code, reason) {
        MessageModel.RemoveClient(ws);
        console.error("关闭", code, reason);
        wss.broadcast(JSON.stringify({
            data: "有人离线了"
        }))
    })
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};