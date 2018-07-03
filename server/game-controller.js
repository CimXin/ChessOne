class GameController {
    constructor() {

    }
    listener(ws, msg) {
        var data = JSON.parse(msg);
        var code = data.code;

        if (code == "onLogin") {
            console.log("开始注册");
            ws.send(JSON.stringify({
                msg: "注册成功"
            }));
        }

    }
}

module.exports = GameController;