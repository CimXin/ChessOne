module co {
	export class BaseMediator extends puremvc.Mediator implements puremvc.IMediator {

		public static VIEW_COMPONENT_NAME_KEY = "BaseMediatorName";

		public constructor(viewComponent: any, name: string) {
			super(name, viewComponent);
			this.viewComponent[BaseMediator.VIEW_COMPONENT_NAME_KEY] = name;
		}

		public listNotificationInterests(): Array<any> {
			return this.viewComponent.regNotification();
		}

		public handleNotification(notification: puremvc.INotification): void {
			this.viewComponent.handleNotification(notification);
		}
	}
}