module co {
	export class BasePanel extends CComponent {
		protected viewData: any = null;
		private isRegistered: boolean = false;
		private isDestroy = false;
		public _popType: number = PanelType.None;

		public constructor(viewData?) {
			super();

			this.viewData = viewData;
			this.name = "view_" + this.hashCode;
		}

		protected initApp(skinName: string = "", isAsync: boolean = false) {
			this.init('app/' + skinName, isAsync);
		}

		protected init(skinName: string = "", isAsync: boolean = false) {
			this.skinName = SourceUtils.themeBase() + skinName;
			this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
		}

		protected createCompleteEvent(event: egret.Event) {
			this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);

			this.registerMediator();
			this.resize();
			this.onCreate();
		}

		protected registerMediator() {
			if (this.isRegistered) return;
			var mediator: puremvc.IMediator = this.mediator();
			if (mediator) AppFacade.getInstance().registerMediator(mediator);
			this.isRegistered = true;
		}


		/**注册puremvc事件 */
		protected mediator(): puremvc.IMediator {
			return null;
		}

		public regNotification(): Array<any> {
			return [];
		}

		public handleNotification(notification: puremvc.INotification) {

		}

		/**页面适配处理 */
		protected resize() {

		}

		protected onCreate() {

		}


		public onRefresh() {

		}

		public onDestroy(mediatorName?: string) {
			this.isDestroy = true;
			this.viewData = null;

			this.removeMediator(mediatorName);
			EventManager.removeEventListeners(this);
		}

		public removeMediator(mediatorName?: string): void {
			var self = this;
			var myMet = BaseMediator.VIEW_COMPONENT_NAME_KEY;
			!mediatorName && (mediatorName = self[myMet], delete self[myMet]);
			mediatorName && AppFacade.getInstance().removeMediator(mediatorName);
			this.isRegistered = false;
		}
	}
}