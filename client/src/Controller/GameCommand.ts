module co {
	export class GameCommand extends puremvc.SimpleCommand implements puremvc.ICommand {
		//游戏初始化
		public static onInitGame: string = "onInitGame";
		public register(): void {
			this.facade.registerCommand(GameCommand.onInitGame, GameCommand);
		}

		public execute(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
			switch (notification.getName()) {
				case GameCommand.onInitGame: {
					console.warn("进入游戏场景");
					break;
				}
			}
		}
	}
}