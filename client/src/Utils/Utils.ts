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

		/**
		* 创建一个定时器
		* listener : 监听函数
		* thisObject : 对象
		* second : 定时间隔（秒）默认一秒
		* repeat : 重复次数，默认0，一直调
		*/
		public static createTimer(listener: Function, thisObject: any, second: number = 1, repeat: number = 0) {
			var timer = new egret.Timer(second * 1000, repeat);
			timer.addEventListener(egret.TimerEvent.TIMER, listener, thisObject);
			return timer;
		}

		public static removeTimer(time: egret.Timer, listener: Function, thisObject: any) {
			time.stop();
			time.removeEventListener(egret.TimerEvent.TIMER, listener, thisObject);
		}
	}
}

function debug(message) {
	if (!DEBUG) {
		return;
	}
	console.warn(message);
}