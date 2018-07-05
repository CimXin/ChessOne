module co {
	export class CComButton extends CComponent {
		public image_bg: eui.Image;
		public label_text: eui.Label;

		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
		}

		public setText(text: string) {
			this.label_text.text = text;
		}

		public setTextSize(fontSize: number) {
			this.label_text.size = fontSize;
		}

		public set disabled(disable: boolean) {
			this.enabled = !disable;
		}

		public get disabled() {
			return !this.enabled;
		}

		public setImage(bg) {
			this.image_bg.source = bg;
		}

		public addNotify(target, lisenter: Function) {
			this.removeNotify();
			EventManager.addScaleListener(this, 0.95, target, lisenter);
		}

		public removeNotify() {
			EventManager.removeEventListener(this);
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage();
		}

	}
}