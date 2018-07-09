module co {
	export class Utils {

		public static getAppExml(path: string, fileName: string) {
			return SourceUtils.themeBase() + "app/" + path + "/" + fileName;
		}

		/**
		 * 微信小游戏环境
		 */
		public static isWxGame() {
			return egret.RuntimeType.WXGAME == egret.Capabilities.runtimeType;
		}
	}
}

function debug(message) {
	if (!DEBUG) {
		return;
	}
	console.warn(message);
}