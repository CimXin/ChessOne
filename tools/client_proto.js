console.log("================================\n 启动客户端成功协议脚本 \n  ->将多协议文件合成一个game.proto文件");

var fs = require('fs');
var readLine = require("readline");
var os = require("os");
var config = require('./config');

function main() {
    travelProtoFiles(config.protoPath());
}

/**
 * 遍历proto文件夹所有proto文件
 */
function travelProtoFiles(protoPath) {
    var fileNames = fs.readdirSync(protoPath);
    var clientProtoPath = config.clientProtoPath() + "/game.proto";
    if (fs.existsSync(clientProtoPath)) {
        fs.unlinkSync(clientProtoPath);
    }

    writeProtoFile(fileNames, 0, clientProtoPath, protoPath);
}

/**
 * 将单个proto文件递归写入game.proto文件
 */
function writeProtoFile(fileNames, index, clientProtoPath, protoPath) {
    if (index + 1 > fileNames.length) {
        console.log(" 打包game.proto文件完毕！\n================================");
        return;
    }
    var rl = readLine.createInterface({
        input: fs.createReadStream(protoPath + "/" + fileNames[index])
    });

    rl.on("line", (line) => {
        if (line.indexOf("syntax") != -1 || line.indexOf("option opti") != -1 ||
            line.indexOf("package ") != -1 || line.indexOf("import ") != -1) {
            return;
        }
        fs.appendFileSync(clientProtoPath, line + os.EOL);
    });
    rl.on("close", () => {
        console.log("  -->读取 【%s】 完毕！", fileNames[index]);
        writeProtoFile(fileNames, index + 1, clientProtoPath, protoPath);
    });
}

main();