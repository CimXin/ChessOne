module co {
	export class CRect extends eui.Rect{

		public static width = 2;
		public static height = 2;

		public constructor(color?) {
			super(CRect.width, CRect.height, color);
		}

		public setWidth(width) {
			this.scaleX = width / CRect.width;
		}

		public setHeight(height) {
			this.scaleY = height / CRect.height;
		}

		public setAnchorCenter() {
			this.anchorOffsetX = CRect.width / 2;
			this.anchorOffsetY = CRect.height / 2;
		}
	}
}