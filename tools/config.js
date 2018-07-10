/**配置文件 文件目录等配置 */


var Config = function () {};
module.exports.Config = Config;
/**
 * 获取当前项目的根目录 eg. /Users/xxx/Documents/privateP/ChessOne
 * 支持Mac、Linux系统，windows系统未测试
 */
module.exports.rootPath = function () {
    var path = require("path");
    var currentPath = path.dirname(require.main.filename);
    var pathArr = currentPath.split("/");
    pathArr.pop();
    return pathArr.join("/");
}

/**
 * 协议文件路径
 */
module.exports.protoPath = function () {
    var rootPath = this.rootPath();
    return rootPath + "/server/proto";
}

/**
 * 合成之后服务端协议路径
 */
module.exports.serverProtoPath = function () {
    return this.rootPath() +"/server/message" 
}