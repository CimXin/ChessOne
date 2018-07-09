module co {

    export class CSocketCallback {
        private m_pCallback: Function;
        private m_pTarget: any;
        private m_pParam: any;
        private m_iTime: any;

        public constructor(callback: Function, target: any, param?: any) {
            this.m_pTarget = target;
            this.m_pCallback = callback;
            this.m_pParam = param;
            // this.m_iTime = Utils.getTime();
        }
        /**
       * 是否过期
       */
        // public isExpire() {
        //     return Utils.getTime() - this.m_iTime > 10;
        // }

        public call(object: any, protocol: number = 0) {
            if (this.m_pTarget && this.m_pTarget.m_bIsClose) {
                return;
            }
            this.m_pCallback.call(this.m_pTarget, object, protocol, this.m_pParam);
        }

        public clear(): void {
            this.m_pTarget = null;
            this.m_pCallback = null;
            this.m_pParam = null;
        }
    }

    export class CSocket {
        private static TIMER: number = 20;
        protected static _instance: CSocket;

        public static getInstance() {
            if (!CSocket._instance) {
                CSocket._instance = new CSocket();
            }
            return CSocket._instance;
        }

        protected m_pSocket: CWebSocket;

        protected m_bIsConnected: Boolean = false;
        protected m_bIsReConnect = false;  //是否重连中
        protected m_iReConnectCount = 1;
        // protected m_bIsBattle;

        protected m_pRequestCalls: any;

        protected m_pConnectedObj: any;
        protected m_pConnectedCallback: Function;

        protected m_pDisconnectObj: any;
        protected m_pDisconnectCallback: Function;

        protected m_pResLogin: any;

        protected m_pHeartbeatTimer: egret.Timer;
        protected m_pCheckTimer: egret.Timer;

        protected m_pIp: string;
        protected m_pPort: number;

        protected m_iCheckAliveTimeout;  //检查链接是否存活

        public constructor() {
            this.m_pRequestCalls = {};
            // this.m_pHeartbeatTimer = new egret.Timer(1000 * CSocket.TIMER, 0);
            // this.m_pHeartbeatTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);

            // this.m_pCheckTimer = Utils.createTimer(this.onCheckTimer, this, 5);
            // this.m_bIsBattle = false;

            this.createSocket();
        }

        public connect(callback: Function, object: any, disCallback?, disObj?) {

            this.m_bIsReConnect = false;
            this.m_iReConnectCount = 1;

            this.m_pConnectedObj = object;
            this.m_pConnectedCallback = callback;

            this.m_pDisconnectCallback = disCallback;
            this.m_pDisconnectObj = disObj;

            this.doConnect();
        }

        public setConnectInfo(ip: string, port: number, gameServer = true) {
            this.m_pIp = ip;
            this.m_pPort = port;
        }

        private createSocket() {
            if (!this.m_pSocket) {
                this.m_pSocket = new CWebSocket();
                this.m_pSocket.type = egret.WebSocket.TYPE_BINARY;
                this.m_pSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceive, this);
                this.m_pSocket.addEventListener(egret.Event.CONNECT, this.onConnected, this);
                this.m_pSocket.addEventListener(egret.Event.CLOSE, this.onClose, this);
                this.m_pSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            }
        }

        protected doConnect() {
            this.createSocket();

            // if (AppConfig.IS_HTTPS == 0) {
            this.m_pSocket.connect(this.m_pIp, this.m_pPort);
            // } else {
            // 	var ipPort = "wss:" + this.m_pIp + ":" + this.m_pPort;
            // 	this.m_pSocket.connectByUrl(ipPort);
            // }
        }

        protected sendTest() {
            // this.m_pSocket.writeUTF(JSON.stringify({ data: "onLogin" }));
            var param = ProtoBuilder.newClazz(ConfigProto.Common);
            param.name = "mic";
            this.requestWithCallback(param, (data) => {
                console.error(data);
            }, this);
        }

        public sendProtocol(protocol: number, sendData: any) {
            if (!this.m_pSocket) return;
            var byteArray: egret.ByteArray = null;
            var newBytes: egret.ByteArray = new egret.ByteArray();

            byteArray = new egret.ByteArray(sendData.toArrayBuffer());
            newBytes.writeInt(protocol);
            newBytes.writeBytes(byteArray);
            this.sendBytes(newBytes);
            byteArray.clear();
            newBytes.clear();
        }

        public sendBytes(bytes: egret.ByteArray) {
            this.m_pSocket.writeBytes(bytes);
            this.m_pSocket.flush();
        }

        public requestWithProtocol(protocol: number, callback?: Function, target?: any) {
            var param = ProtoBuilder.newClazz(protocol);
            this.requestWithCallback(param, callback, target);
        }

        public requestWithCallback(param: any, callback?: Function, target?: any, self_param?: any) {
            var protocol = param.protocol;
            var resProtocol = ConfigProto.getResProtocol(param.protocol);
            if (callback && target) {
                var socketCall = new CSocketCallback(callback, target, self_param);
                if (!this.m_pRequestCalls[resProtocol]) {
                    this.m_pRequestCalls[resProtocol] = [];
                }
                var proArr = this.m_pRequestCalls[resProtocol];
                proArr.push(socketCall);
            }
            this.sendProtocol(protocol, param);
        }

        //根据协议请求，适用没有数据的空对象
        public static requestWithProtocol(protocol: number, callback?: Function, target?: any) {
            return this.getInstance().requestWithProtocol(protocol, callback, target);
        }

        //请求数据
        public static requestWithCallback(param: any, callback?: Function, target?: any) {
            return this.getInstance().requestWithCallback(param, callback, target);
        }

        private onReceive() {
            var byteArray: egret.ByteArray = new egret.ByteArray();
            this.m_pSocket.readBytes(byteArray);

            var protoBytes: egret.ByteArray = new egret.ByteArray();
            byteArray.readBytes(protoBytes, 0, byteArray.length - 4);

            byteArray.position = byteArray.length - 4;
            byteArray.endian = egret.Endian.LITTLE_ENDIAN;
            var protocol = byteArray.readInt();
            // protoBytes.endian = egret.Endian.LITTLE_ENDIAN;
            // protoBytes.buffer.en
            var data = ProtoBuilder.decode(protocol, protoBytes.buffer);

            byteArray.clear();
            protoBytes.clear();

            if (!data) {
                console.warn('没有配该协议:' + protocol);
                return;
            }

            var proArr: Array<any> = this.m_pRequestCalls[protocol];
            if (proArr && proArr.length > 0) {
                var socketCall = <CSocketCallback>proArr.pop();
                if (socketCall) {
                    socketCall.call(data, protocol);
                    socketCall.clear();
                    // delete this.m_pRequestCalls[protocol];
                }
                return;
            }

            this.parseProtocol(protocol, data);
        }

        //解析协议（没有请求返回的，服务器主动发过来的）
        public parseProtocol(protocol: number, data: any) {
            this.nofify(protocol, data);
        }

        protected onConnected() {
            console.log("csocket onConnected");

            this.m_bIsConnected = true;
            this.m_iReConnectCount = 1;
            this.m_bIsReConnect = false;

            this.sendTest();
        }

        public close(isSelf = true) {
            this.onClose(null, isSelf);
        }

        public onClose(e: egret.Event = null, isSelf: boolean = false) {
            if (!this.m_pSocket || !this.m_bIsConnected) {
                return;
            }

            this.onClear();
            if (!isSelf) {
                // this.onDisconnect();
            }
        }

        private onError() {
            this.onClose(null);
        }

        protected onClear() {
            this.stopHeartbeat();

            this.m_bIsConnected = false;
            this.m_pResLogin = null;

            if (this.m_pSocket) {
                this.m_pSocket.close();
                this.m_pSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceive, this);
                this.m_pSocket.removeEventListener(egret.Event.CONNECT, this.onConnected, this);
                this.m_pSocket.removeEventListener(egret.Event.CLOSE, this.onClose, this);
                this.m_pSocket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
                this.m_pSocket = null;
            }
        }

        private stopHeartbeat() {
            this.clearCheckAlive();
            this.m_pHeartbeatTimer.stop();
            this.m_pCheckTimer.stop();
            this.m_pRequestCalls = {};
        }

        protected clearCheckAlive() {
            if (this.m_iCheckAliveTimeout) {
                egret.clearTimeout(this.m_iCheckAliveTimeout);
                this.m_iCheckAliveTimeout = null;
            }
        }

        public nofify(protocol: number, data: any) {
            // debug('PushNotify parseProtocol:' + protocol, data);
            var pro = ConfigProto;
        }

    }
}