module co {
	export class ViewPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

		public execute(notification: puremvc.INotification): void {
			var data = notification.getBody();
			this.facade.registerMediator(new AppFacade(data));
		}
	}
}