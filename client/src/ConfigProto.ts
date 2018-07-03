module co {
	export class ConfigProto {
		private static _instance: ConfigProto;

		public static getInstance() {
			if (!ConfigProto._instance) {
				ConfigProto._instance = new ConfigProto();
			}
			return ConfigProto._instance;
		}

		private m_pProtocolMap: Array<any>;

		public static Common: number = 12340; //test

		public constructor() {
			this.m_pProtocolMap = new Array();
			this.register(ConfigProto.Common, "HelloRequest","HelloReply");
		}

		private register(protocol: number, reqClazz: string, resClazz: string = null) {
			this.m_pProtocolMap[protocol] = reqClazz;
			if (resClazz) {
				var resProtocol = ConfigProto.getResProtocol(protocol);
				this.m_pProtocolMap[resProtocol] = resClazz;
			}
		}

		//根据请求协议返回响应协议
		public static getResProtocol(protocol: number) {
			return protocol + 1;
		}

		//根据响应协议返回请求协议
		public static getReqProtocol(protocol: number) {
			return protocol - 1;
		}

		public getProtocol(protocol: number) {
			return this.m_pProtocolMap[protocol];
		}

		public static getProtocol(protocol: number) {
			return ConfigProto.getInstance().getProtocol(protocol);
		}
	}
}