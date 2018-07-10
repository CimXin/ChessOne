
module co {

    export class LoadingUI extends CComponent {
        public group_progress: eui.Group;
        public image_progress: eui.Image;
        public label_progress: eui.Label;
        public label_tips: eui.Label;

        private m_pLoadControl: LoadControl;
        public constructor(control) {
            super();
            this.skinName = Utils.getAppExml("setting", "LoadingUISkin.exml");
            this.m_pLoadControl = control;
        }

        public childrenCreated() {
            super.childrenCreated();

            this.resize();

        }

        public setProgress(current, total) {
            if (current == 0) {
                this.image_progress.width = 0;
            } else {
                if (current > total) {
                    current = total;
                }
                var progress = current / total;
                this.image_progress.width = progress * 439;
                // this.label_progress.text = ((progress * 100) >> 0) + "%";
            }
        }

        public setPercent(percent) {
            this.image_progress.width = percent / 100 * 439;
            this.label_progress.text = String(percent) + "%";
        }

        public setProgressTip(text) {
            this.label_progress.text = text;
        }

        /**设置版本号 */
        public setVersionText() {

        }

        public setTip(text) {
            this.label_tips.text = text;
        }

        public resize() {

        }

        public onDestroy() {
            this.parent.removeChild(this);
        }
    }

}