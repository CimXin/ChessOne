module co {
	export class AppFacade extends puremvc.Facade implements puremvc.IFacade {

		public static ACTION_NAME: string = "";
		public static STARTUP: string = "startup";

		public static getInstance(): AppFacade {
			if (!this.instance) {
				this.instance = new AppFacade();
			}
			return this.instance as AppFacade;
		}

		public static sendNotification(name: string, body?: any, type?: string) {
			AppFacade.ACTION_NAME = name;
			AppFacade.getInstance().sendNotification(name, body, type);
		}

		public initializeController() {
			super.initializeController();
			this.registerCommand(AppFacade.STARTUP, StartupCommand);
		}

		// public startUp(rootView: egret.DisplayObjectContainer) {
		// 	this.sendNotification(ApplicationFacade.STARTUP, rootView);
		// 	this.removeCommand(ApplicationFacade.STARTUP); //PureMVC初始化完成，注销STARUP命令
		// }

	}
}