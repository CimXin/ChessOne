module co {
	export class StartupCommand extends puremvc.MacroCommand {
		public initializeMacroCommand() {
			this.addSubCommand(ControllerPrepCommand);
			this.addSubCommand(ViewPrepCommand);
		}
	}
}