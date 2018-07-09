class CCSkinCache {
	private static m_pSkinMap: Object = {};


	public static addSkin(skinName: string, skinContent: string, isPreLoad: boolean): void {
		this.m_pSkinMap[skinName] = {};

		this.m_pSkinMap[skinName]['exml'] = [0, skinContent];;
		if (isPreLoad) {
			this.getSkinFunc(skinName);
		}
	}

	public static addJSSkin(skinName: string, skinContent: string, isPreLoad: boolean): void {
		this.m_pSkinMap[skinName] = {};
		if (isPreLoad) {
			this.m_pSkinMap[skinName]['func'] = EXML.$parseURLContentAsJs('', skinContent, skinName);
		} else {
			this.m_pSkinMap[skinName]['exml'] = [1, skinContent];
		}

	}

	public static getTheme(skinName: string): any {
		// console.log("getTheme:",skinName);
		var skin: string;
		if (typeof (skinName) == 'function') {
			return skinName;
		} else if (skinName.indexOf("<?xml version='1.0' encoding='utf-8'?>") > -1) {
			return EXML.$parseURLContent("", skinName);
		} else if (skinName.indexOf('/') > -1) {
			var splits: any[] = skinName.split('/');
			skin = splits[splits.length - 1].replace('.exml', '');
		} else {
			skin = skinName.replace('.exml', '');
		}

		return this.getSkinFunc(skin);
	}

	public static getSkinFunc(skinName: string): any {
		let name = skinName;
		let exml = this.m_pSkinMap[name]['exml'];
		if (exml) {
			if (exml[0] == 0) {
				this.m_pSkinMap[skinName]['func'] = EXML.$parseURLContent("", exml[1]);
			} else {
				this.m_pSkinMap[name]['func'] = EXML.$parseURLContentAsJs("", exml[1], skinName);
			}
			delete this.m_pSkinMap[name]['exml'];
		}
		return this.m_pSkinMap[name]['func'];
	}

	public static destroy(): void {
		this.m_pSkinMap = null;
	}
}
class CCTheme extends eui.Theme {
	private $url: string;
	public constructor(configURL: string, stage: egret.Stage) {
		if (DEBUG) {
			super(configURL, stage);
		} else {
			super('', stage);

			this.$url = configURL;
			this.loadTheme(configURL, stage);
		}
	}

	private loadTheme(url: string, stage: egret.Stage): void {
		var adapter: eui.IThemeAdapter = stage ? stage.getImplementation("eui.IThemeAdapter") : null;
		if (!adapter) {
			adapter = new eui.DefaultThemeAdapter();
		}
		adapter.getTheme(url, this.onThemeLoaded, this.onThemeLoaded, this);
	}

	private onThemeLoaded(str: string): void {

		if (str) {
			if (DEBUG) {
				try {
					var data = JSON.parse(str);
				}
				catch (e) {
					egret.$error(3000);
				}
			} else {
				var data = JSON.parse(str);
			}
		} else if (DEBUG) {
			egret.$error(3000, this.$url);
		}
		if (data.exmls[0]['gjs']) {
			data.exmls.forEach((exml, index, exmls) => this.parseURLContentAsJs(exml, data.skins, exmls));
		} else {
			var isContent: boolean = data.exmls[0]['content'] ? true : false;
			data.exmls.forEach((exml, index, exmls) => this.parseURLContent(exml, isContent, data.skins, exmls));
		}

		this.dispatchEventWith(egret.Event.COMPLETE);
		// egret.callLater(function(){
		//     if (data.exmls[0]['gjs']) {
		//         data.exmls.forEach((exml,index, exmls) => this.parseURLContentAsJs(exml,data.skins, exmls));
		//     }else{
		//         var isContent: boolean = data.exmls[0]['content'] ? true : false;
		//         data.exmls.forEach((exml,index, exmls) => this.parseURLContent(exml,isContent,data.skins, exmls));
		//     }
		// }, this);
	}

	private parseURLContentAsJs(exml: any, preLoadList: any, exmls: any): void {
		let gjs: string = exml['gjs'];
		let splits: any[] = exml['path'].split('/');
		let skinName: string = splits[splits.length - 1].replace('.exml', '');

		CCSkinCache.addJSSkin(skinName, gjs.replace(/let /g, 'var '), preLoadList[skinName]);
	}

	private parseURLContent(exml: any, isContent: boolean, preLoadList: any, exmls: any): void {
		var path: string;
		var content: string;

		if (isContent) {
			path = exml['path'];
			content = exml['content'];
		} else {
			path = exml;
			content = exml;
		}
		var splits: any[] = path.split('/');
		var skinName: string = splits[splits.length - 1].replace('.exml', '');


		CCSkinCache.addSkin(skinName, content, preLoadList[skinName] /*path.indexOf('/components/') > 0 ? SkinCacheType.Cache : SkinCacheType.Byte*/);
	}
}
