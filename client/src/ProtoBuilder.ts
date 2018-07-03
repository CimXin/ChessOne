module co {
	export class ProtoBuilder {
		private m_pBuilder: any;
		private m_pCacheClazz: any = {};

		private static _instance: ProtoBuilder;

		public static getInstance() {
			if (!ProtoBuilder._instance) {
				ProtoBuilder._instance = new ProtoBuilder();
			}
			return ProtoBuilder._instance;
		}

		public constructor() {
			var proto = RES.getRes("test_proto");
			this.m_pBuilder = dcodeIO.ProtoBuf.loadProto(proto);
		}

		public getClazz(name: string) {
			if (!this.m_pCacheClazz[name]) {
				this.m_pCacheClazz[name] = this.m_pBuilder.build(name);
			}
			return this.m_pCacheClazz[name];
		}

		public newClazz(protocol: number) {
			var name = ConfigProto.getProtocol(protocol);
			if (!name) {
				console.warn("未找到协议", name);
				return;
			}
			var clazz = this.getClazz(name);
			var instance = new clazz();
			instance.protocol = protocol;
			return instance;
		}

		public decode(protocol: number, buffer: any) {
			var name = ConfigProto.getProtocol(protocol);
			if (!name) {
				console.warn("未找到协议", name);
				return;
			}
			var clazz = this.getClazz(name);
			if (!clazz) return;
			return clazz.decode(buffer);
		}

		//获取类
		public static getClazz(name: string) {
			return ProtoBuilder.getInstance().getClazz(name);
		}

		//新建一个实例
		public static newClazz(protocol: number) {
			return ProtoBuilder.getInstance().newClazz(protocol);
		}

		//解析
		public static decode(protocol: number, buffer: any) {
			return ProtoBuilder.getInstance().decode(protocol, buffer);
		}
	}
}