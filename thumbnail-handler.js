
class ThumbnailHandler {
    constructor(layers) {
        this.rlotties = [];
        layers.forEach(l => {
            var rm = new RLottieModule(l.id, true);
            this.makeThumbnail(rm, l.keypath, l.type);
            this.rlotties.push(rm);
        });
    }

    render() {
        this.rlotties.forEach(rm => {
            rm.render(1);
            if(rm.curFrame >= rm.frameCount) rm.curFrame = 0;
        })
    }

    reload(layers, jsString) {
        setTimeout(() => {
            this.rlotties = [];
            layers.forEach(l => {
                var rm = new RLottieModule(l.id, true);
                rm.lottieHandle.load(jsString);
                this.makeThumbnail(rm, l.keypath, l.type);
                this.rlotties.push(rm);
            });
        }, 500)
    }

    setModuleCanvas(layers) {
        for(let i = 0; i < layers.length; i++) {
            this.rlotties[i].canvasId = layers[i].id;
            this.rlotties[i].canvas = document.getElementById(layers[i].id);
            this.rlotties[i].context = this.rlotties[i].canvas.getContext("2d");
        }
    }

    makeThumbnail(module, keypath, type) {
        module.lottieHandle.setFillOpacity("**", 0);
        module.lottieHandle.setStrokeOpacity("**", 0);
        module.lottieHandle.setFillOpacity(keypath + ".**", 100);
        module.lottieHandle.setStrokeOpacity(keypath + ".**", 100);
    }
}