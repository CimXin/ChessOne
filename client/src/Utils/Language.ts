module co {
	export class Language {
		public static instance: Language;

		private _Language: Array<any>;

		public static getInstance() {
			if (!Language.instance) {
				Language.instance = new Language();
			}
			return Language.instance;
		}

		public loadLocalLan() {
			var data = RES.getRes("LanguageCn_json");
			if (!data) {
				return;
			}
			debug(data);

			for (var i = 0; i < data.length; ++i) {
				this._Language[data[i]] = data[i];
			}

		}

		public lan(key) {
			return this._Language[key];
		}
	}
}