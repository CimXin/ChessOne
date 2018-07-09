module co {
	export enum LoadType {
		ReqServer = 1, //请求服务器列表
		Theme = 2, 	  //加载皮肤
		Language = 3, //加载语言包
		Resource = 4, //加载资源
	};
	export class LoadControl {
		public static IS_START_ENTER = false;  //是否已经开始进入游戏了

		private main: Main;
		private _loadView: LoadingUI;
		private _loadCfg = new Array();

		public constructor(main) {
			this.main = main;
			LoadControl.IS_START_ENTER = false;

			this._loadView = new LoadingUI(this);
		}

		public createView() {
			co.AppMediator.app().popUpLevel.addChild(this._loadView);
			this._loadView.setPercent(10);
		}

		public setStartCfg() {
			this._loadCfg[LoadType.Theme] = 0;
			this._loadCfg[LoadType.Resource] = 0;
			this._loadCfg[LoadType.ReqServer] = 0;
		}

		public setComplete(type) {
			this._loadCfg[type] = 1;
			var loadFinish = true;
			this._loadCfg.forEach((value, index) => {
				if (value == 0) {
					loadFinish = false;
					this._loadView.setProgressTip(index);
				}
			});

			if (loadFinish) {
				debug("加载完成");
				this.onLoadCompleted();
			}
		}
		/**
		 * 第0步 从游戏中心服拉取玩家基本数据
		 */

		public reqServerData() {
			if (Utils.isWxGame()) {
				debug("微信登录 todo");
			} else {
				this.requestServerData();
			}
		}

		public requestServerData() {
			//从游戏中心服拉取玩家数据 然后再登录游戏服
			this.setReqServerComplete();
		}

		/**
		 * 玩家基本信息拉取完毕
		 * 服务器部分完毕
		 */
		public setReqServerComplete() {
			this.setComplete(co.LoadType.ReqServer);
		}

		public onLoadCompleted() {
			this.loginClick();
		}

		public loginClick() {
			AppConfig.OPEN_ID = 'test123';
			if (!AppConfig.OPEN_ID) {

			} else {
				this.loadConfig();
			}
		}

		/**第一步 开始加载配置文件 */
		public loadConfig() {
			LoadControl.IS_START_ENTER = true;
			this._loadView.setTip("正在加载配置文件...");
			this._loadView.setPercent(45);
			this.onConfigCompleted();
		}

		/**配置文件加载完毕
		 * 第二步 开始加载语言包 
		 * */
		public onConfigCompleted() {
			this.onServerLanCompleted();
		}

		/**
		 * 语言包加载完毕
		 * 
		 */
		public onServerLanCompleted() {
			this._loadView.setPercent(55);
			this._loadView.setTip("正在加载语言文件...");
			this.connectServer();
		}

		/**第三步 开始连接服务器 */
		public connectServer() {
			this._loadView.setPercent(78);
			debug("开始连接服务器...");
		}

	}
}