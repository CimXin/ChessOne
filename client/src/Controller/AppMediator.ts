module co {
	export class AppMediator extends puremvc.Mediator implements puremvc.IMediator {
		private m_pRoot: eui.UILayer;//根
		private m_pMenuLevel: egret.DisplayObjectContainer;//菜单层
		private m_pPopupLevel: egret.DisplayObjectContainer;//弹窗层

		public constructor(viewComponent: any) {
			super(AppMediator.NAME, viewComponent);
			this.setup(viewComponent);
		}

		private setup(root: eui.UILayer) {
			this.m_pMenuLevel = this.addLayer("menu", root);
			this.m_pPopupLevel = this.addLayer("popUp", root);

			this.m_pRoot = root;
		}

		public addLayer(name: string, root: eui.UILayer) {
			var layer = new egret.DisplayObjectContainer();
			layer.name = name;
			root.addChild(layer);
			return layer;
		}

		public get root(): eui.UILayer {
			return this.m_pRoot;
		}

		public get frameRate(): number {
			return this.m_pRoot.stage.frameRate;
		}

		public get screenWidth(): number {
			return this.m_pRoot.stage.$screen['canvas']['clientWidth'];
		}

		public get screenHeight(): number {
			return this.m_pRoot.stage.$screen['canvas']['clientHeight'];
		}

		public get stageWidth(): number {
			return this.m_pRoot.stage.stageWidth;
		}

		public get stageHeight(): number {
			return this.m_pRoot.stage.stageHeight;
		}

		public get screenScale(): number {
			var screenScale: number = this.screenHeight / this.screenWidth;
			var standardScale: number = AppConfig.CONTENT_HEIGHT / AppConfig.CONTENT_WIDTH;

			var scale: number = screenScale / standardScale + 0.1;//浏览器占用差值
			var tmpScale: number = screenScale / 1.5;

			if (scale > 0.95 && scale < 1) {
				scale = tmpScale < 1 ? (scale - 0.1) : 0.95;
			}
			return scale > 1 ? 1 : scale;
		}

		/**判断屏幕的宽高比是否 大于16：9 */
		public get scaleWidthHeigh() {
			var width = this.stageWidth;
			var height = this.stageHeight;
			if (width / height <= 16 / 9) {
				return false;
			}
			return true;
		}

		public get menuLevel(): egret.DisplayObjectContainer {
			return this.m_pMenuLevel;
		}

		public get popUpLevel(): egret.DisplayObjectContainer {
			return this.m_pPopupLevel;
		}

		public listNotificationInterests(): Array<any> {
			return [];
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
			}
		}

		public static app(): AppMediator {
			return <AppMediator><any>AppFacade.getInstance().retrieveMediator(AppMediator.NAME);
		}

		public static get scale() {
			return AppMediator.app().screenScale;
		}

		private removeAll() {
			egret.Tween.removeAllTweens();
			CSocket.getInstance().close();

			this.m_pMenuLevel.removeChildren();
			this.m_pPopupLevel.removeChildren();
		}

		private clearData() {

		}

	}
}