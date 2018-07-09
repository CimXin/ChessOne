class CWebSocket extends egret.WebSocket {

    public static CONNECT_TIMEROUT = 10000;
    private m_iConnectTimeout;

    public constructor() {
        super();
        this.addEventListener(egret.Event.CONNECT, this.onConneted, this);
    }

    connect(host: string, port: number): void {
        super.connect(host, port);
        this.setConnectTimeout();
    }

    private setConnectTimeout() {
        this.clearConnectTimeout();
        this.m_iConnectTimeout = egret.setTimeout(this.onConnectTimeout, this, CWebSocket.CONNECT_TIMEROUT);
    }

    private clearConnectTimeout() {
        if (this.m_iConnectTimeout) {
            egret.clearTimeout(this.m_iConnectTimeout);
            this.m_iConnectTimeout = null;
        }
    }

    private onConnectTimeout() {
        this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
    }

    private onConneted() {
        this.clearConnectTimeout();
    }

}
