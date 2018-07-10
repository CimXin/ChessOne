console.log("================================\n 启动服务端脚本 \n  ->将多协议文件合成一个json文件");

var fs = require("fs");

function main() {
    var config = require('./config');
    var protoPath = config.protoPath();
    var serverProtoPath = config.serverProtoPath();
    var protoFiles = travelProtoFiles(protoPath);

    checkServerProtoPath(serverProtoPath);
    var exec = require('child_process').exec;
    var cmd = "pbjs -t json test.proto test1.proto  > test.json";
    cmd = `pbjs -t json ${protoFiles}  > ${serverProtoPath+"/proto.json"}`
    exec(cmd, function (error, stdout, stderr) {
        console.log(" 合成proto.json文件完毕！\n================================")
    });
}

/**
 * 遍历proto文件夹所有proto文件
 */
function travelProtoFiles(protoPath) {
    var fileNames = fs.readdirSync(protoPath);
    var allFileNames = "";
    fileNames.forEach((name) => {
        console.log("  -->", name);
        allFileNames += protoPath + "/" + name + " ";
    });
    return allFileNames;
}

/**
 * 检查服务端是否存在message文件夹
 */
function checkServerProtoPath(protoPath) {
    if (!fs.existsSync(protoPath)) {
        fs.mkdirSync(protoPath);
    }
}

main();