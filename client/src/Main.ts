
class Main extends eui.UILayer {

    private m_pLoadControl: co.LoadControl = null;

    public constructor() {
        super();
    }

    public createChildren() {
        super.createChildren();

        this.m_pLoadControl = new co.LoadControl(this);
        this.m_pLoadControl.setStartCfg();

        RES.setMaxLoadingThread(5);

        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.loadResConfig();
    }

    /**
     * 加载资源
     */
    public loadResConfig() {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        var resourceCfg = "default.res.json";

        if (co.Utils.isWxGame()) {
            RES.loadConfig("default.res.json", AppConfig.WXRES_SERVER_CNF + "resource/");
        } else {
            RES.loadConfig(AppConfig.RES_SERVER_CNF + resourceCfg + "?v=" + AppConfig.VERSION, AppConfig.RES_SERVER_CNF);
        }
    }

    public onConfigComplete(event: RES.ResourceEvent) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        var theme = null;
        if (DEBUG) {
            if (co.Utils.isWxGame()) {
                theme = new CCTheme("resource/default.thm.json", this.stage);
            } else {
                theme = new CCTheme(AppConfig.RES_SERVER_CNF + "default.thm.json?v=" + AppConfig.VERSION, this.stage);
            }
            theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        } else {
            this.onThemeLoadComplete();
        }
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
    }

    /**
    * 主题文件加载完成
        开始从游戏中心服拉取玩家的数据
    */
    private onThemeLoadComplete(): void {
        this.m_pLoadControl.setComplete(co.LoadType.Theme);
        this.m_pLoadControl.reqServerData();
        this.loadLaunch();
    }

    /**分组加载完毕回调 */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        var groupName = event.groupName;
        if (groupName == "lanuch") {
            co.Language.getInstance().loadLocalLan();
            this.createLoading();
        } else if (groupName == "FMainUI") {
            this.m_pLoadControl.setComplete(co.LoadType.Resource);

            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        }
    }

    /**
    * 资源组加载出错
    */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
    }

    /**
   * 资源组加载出错
   */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    public createLoading() {
        co.AppFacade.getInstance().startUp(this);
        this.m_pLoadControl.createView();

        this.loadProtoMainUI();
    }

    private loadProtoMainUI() {
        var preloadList = [
            ['proto', 4],
            ['FMainUI', 3]
        ];
        this.loadResByList(preloadList);
    }

    private loadResByList(list): number {
        var preloadTotal: number = 0;
        for (var i = 0; i < list.length; i++) {
            var item: any = list[i];
            preloadTotal += RES.getGroupByName(item[0]).length;
            RES.loadGroup(item[0], item[1]);
        }
        return preloadTotal;
    }

    public loadLaunch() {
        RES.loadGroup("lanuch", 1);
    }

    public enterGame() {
        this.removeControl();
    }

    public removeControl() {
        if (this.m_pLoadControl) {
            this.m_pLoadControl.clearAll();
            this.m_pLoadControl = null;
        }
    }
}