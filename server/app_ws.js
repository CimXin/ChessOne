var WebSocket = require("ws");
// var express = require("express");
// var app = express();
// var server = require("http").createServer();
var protobuf = require("protobufjs").Root;
var testJson = require("./proto/test.json");
var root = protobuf.fromJSON(testJson);
// var helloRequset = root.lookupType("CO.HelloRequest");
var HelloReply = root.lookupType("CO.HelloReply");
var Test = root.lookup("CO.Test");

var wss = new WebSocket.Server({
    port: 3000
});

wss.on("connection", function (ws, req) {
    console.error("链接成功", Test.HelloRequest);
    ws.on("message", function (message) {
        var view = new DataView(message.buffer);
        var protolcol = view.getInt32(6);
        console.log("协议号是->", protolcol);
        console.log("收到 message->", Test.HelloRequest.decode(message));

        // var sendData = HelloReply.encode({
        //     message: "send Hello"
        // }).finish();
        // ws.send(sendData);
        sendProtocol(ws);
    });

    ws.on("close", function (code, reason) {
        console.error("关闭", code, reason);
        wss.broadcast(JSON.stringify({
            data: "有人离线了"
        }))
    })
});


var sendProtocol = function (ws) {
    var message = HelloReply.create({
        message: "Hello Nico"
    });
    var writerBuffer = HelloReply.encode(message);
    writerBuffer.sfixed32(12341);
    var buffer = writerBuffer.finish();

    ws.send(buffer);
}

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};


var someoneOnline = function (ws, data) {
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

