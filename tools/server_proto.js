console.log("================================\n启动服务端脚本 \n ->将多协议文件合成一个json文件");

var config = require('./config');
var rootPath = config.rootPath();
var protoPath = config.protoPath();
var serverProtoPath = config.serverProtoPath();

var exec = require('child_process').exec;
var cmd = "pbjs -t json test.proto test1.proto  > test.json";
cmd = `pbjs -t json ${protoPath+"/GamePlayer.proto"}  > ${serverProtoPath+"/proto.json"}`
exec(cmd, function (error, stdout, stderr) {
    console.log(error, stdout, stderr);
});