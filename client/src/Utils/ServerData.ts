module co {
	export class ServerData {
		/**游戏服IP */
		public static gameServerIp;
		/**游戏服端口 */
		public static gameServerPort;

		public static setGameServerAdd(ip, port) {
			this.gameServerIp = ip;
			this.gameServerPort = port;
		}
	}
}