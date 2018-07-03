'use strict';

var cls = require("../utils/class");
var protobuf = require("protobufjs").Root;
var testJson = require("../proto/test.json");
var root = protobuf.fromJSON(testJson);
var CO = root.lookup("CO");
var CMD = CO.CMD;

var cliend_ws = new Map();

var MessageModel = function () {};

module.exports.MessageModel = MessageModel;

module.exports.AddClient = function (ws) {
    var userId = ws.userId;
    if (!cliend_ws.has(userId)) {
        cliend_ws.set(userId, ws);
    }
}

module.exports.RemoveClient = function (ws) {
    var userId = ws.userId;
    if (cliend_ws.has(userId)) {
        cliend_ws.delete(userId);
    }
}

module.exports.getClient = function (userId) {
    return cliend_ws.get(userId);
}

module.exports.parse = function (protocol, message, userId) {
    var messageName = CMD[protocol];
    var data = CO[messageName].decode(message);
    console.log("解析的数据 -> ", data, userId);

    var data1 = CO.RankData.create({
        name: "tong",
        rank: 1
    });
    var data2 = CO.RankData.create({
        name: "xiazi",
        rank: 2
    });

    this.send(protocol + 1, CO.HelloReply.create({
        message: "Send HelloReply",
        rank: [data1, data2],
        fucku: [1,2]
    }), userId);
}

module.exports.send = function (protocol, message, userId) {
    var messageName = CMD[protocol];
    var sendBuffer = CO[messageName].encode(message);
    sendBuffer.sfixed32(protocol);
    var ws = this.getClient(userId);

    ws.send(sendBuffer.finish());
}

module.exports.broadcast = function (protocol, message) {
    var messageName = CMD[protocol];
    var sendBuffer = CO[messageName].encode(message);
    sendBuffer.sfixed32(protocol);

    cliend_ws.forEach((ws, userId) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(sendBuffer);
        }
    });
}