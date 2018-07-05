module co {
	export enum PanelType {
		None = 0,
		/**弹窗式 */
		Dialog = 1,
		/**全屏 */
		Full = 2,
	}
	export class UpManager {
		public static m_pPanelNum: number = 0;
		private static m_pPanels: BasePanel[] = [];
		private static m_pCurrentPanel: BasePanel = null;
		private static m_pMask: CRect = null;

		public static canTouchBack = true;

		/**
		 * @param show 打开即显示
		 * @param preVisible 上一个面板是否显示
		 * 打开一个弹窗式窗口
		 */
		public static popView(node, style: PanelType.Dialog = PanelType.Dialog, preVisible: boolean = true, isClear: boolean = false) {
			UpManager.pushPanel(isClear, preVisible);
			UpManager.m_pCurrentPanel = node;
			AppMediator.app().popUpLevel.addChild(node);
			if (node._popType == PanelType.None) {
				node._popType = style;
			}
			UpManager.setPanelPosition(node);
			UpManager.mask();
			if (UpManager.panelSize() <= 0) {
				UpManager.popUpShow(node);
			}
		}

		/**把之前的面板push到储存面板数组 */
		public static pushPanel(isClear?: boolean, preVisible: boolean = false) {
			var curPanel = this.m_pCurrentPanel;
			if (isClear) {
				UpManager.close();
			} else if (curPanel) {
				if (curPanel._popType != PanelType.Full) {
					curPanel.visible = preVisible;
				}
				curPanel.touchEnabled = false;
				UpManager.m_pPanels.push(curPanel);
			}
		}

		public static history(bAnima: boolean = true) {
			if (this.panelSize() <= 0 && bAnima) {
				this.popUpClose(this.m_pCurrentPanel, this.closeTopCallBack, this);
			} else {
				this.closeTopCallBack();
			}
		}

		public static close(bAnima: boolean = true) {
			var curPanel = this.m_pCurrentPanel;
			if (!curPanel) return;

			if (bAnima) {
				this.popUpClose(curPanel, this.closeAllCallBack, this);
			} else {
				this.closeAllCallBack();
			}
		}

		public static closeAllCallBack() {
			this.m_pPanels.push(this.m_pCurrentPanel);
			var panels = this.m_pPanels;
			var len = panels.length;
			for (var i = len - 1; i >= 0; --i) {
				let panel = panels.pop();
				this.removePanel(panel);
			}
			this.mask();
		}

		public static closeTopCallBack() {
			this.removePanel(this.m_pCurrentPanel);
			this.mask(false);
			this.m_pCurrentPanel = null;

			if (this.panelSize() > 0) {
				this.m_pCurrentPanel = this.m_pPanels.pop();
			}
			if (this.m_pCurrentPanel) {
				this.m_pCurrentPanel.visible = true;
				this.m_pCurrentPanel.touchEnabled = true;
				this.m_pCurrentPanel.onRefresh();
				this.mask();
			}

		}

		public static panelSize() {
			return this.m_pPanels.length;
		}

		public static popUpClose(panel: BasePanel, next?: Function, thisObject?) {
			if (!panel) {
				next && next.call(thisObject);
				return;
			}
			panel.touchEnabled = panel.touchChildren = false;
			var tween = egret.Tween.get(panel);
			tween.to({ scaleX: 0, scaleY: 0 }, 180, egret.Ease.backIn)
				.call(() => {
					egret.Tween.removeTweens(panel);
					next && next.call(thisObject);
				});
		}

		public static popUpShow(panel: BasePanel, next?: Function, thisObject?) {
			var tw: egret.Tween = egret.Tween.get(panel);
			panel.alpha = 0.01;
			tw.to({ alpha: 1 }, 75)
				.call(() => {
					egret.Tween.removeTweens(panel);
					next && next.call(thisObject);
				})
		}

		public static removePanel(panel: BasePanel) {
			if (!panel)
				panel = this.m_pCurrentPanel;
			if (!panel)
				return;

			panel.onDestroy();
			if (panel.parent) {
				panel.parent.removeChild(panel);
				panel = null;
			}
		}

		public static mask(visible: boolean = true) {
			var layer = AppMediator.app().popUpLevel;
			var mask = this.m_pMask;
			if (!this.m_pMask) {
				mask = this.m_pMask = new CRect(0x000000);
				mask.setWidth(AppMediator.app().stageWidth);
				mask.setHeight(AppMediator.app().stageHeight);
				mask.alpha = 0.75;
				layer.addChild(mask);
				mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskClickListener, this);
			}
			this.updateMaskIndex();
			mask.visible = visible;
		}

		private static onMaskClickListener() {
			if (UpManager.canTouchBack) {
				UpManager.history();
			}
		}

		public static updateMaskIndex(): void {
			var index = 0;
			var self = UpManager;
			var mask = self.m_pMask;
			var panels = self.m_pPanels.concat();
			panels.push(self.m_pCurrentPanel);
			for (let i = panels.length - 1; i > 0; i--) {
				let panel = panels[i];
				if (panel && panel._popType != PanelType.Full) {
					index = i;
					break;
				}
			}
			mask.parent.setChildIndex(mask, index);
		}

		public static setPanelPosition(panel: BasePanel = UpManager.m_pCurrentPanel) {

			panel.anchorOffsetX = panel.width / 2;
			panel.anchorOffsetY = panel.height / 2;

			panel.x = (AppMediator.app().stageWidth) / 2;
			panel.y = (AppMediator.app().stageHeight) / 2;

			if (UpManager.panelSize() <= 0) {
				panel.scaleX = panel.scaleY = 0;
				var tw = egret.Tween.get(panel);
				tw.to({ scaleX: 1, scaleY: 1 }, 220, egret.Ease.backOut);
			}
		}

	}
}