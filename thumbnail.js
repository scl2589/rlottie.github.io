
class ThumbnailHandler {
    constructor(layers) {
        this.rlotties = [];
        layers.forEach(l => {
            var rm = new RLottieModule("thumbnail-" + l.id);
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
                console.log(l.id + " " + l.name);
                var rm = new RLottieModule("thumbnail-" + l.id);
                rm.lottieHandle.load(jsString);
                console.log(l.keypath + " " + l.type);
                this.makeThumbnail(rm, l.keypath, l.type);
                this.rlotties.push(rm);
            });
        }, 500)
    }

    makeThumbnail(module, keypath, type) {
        module.lottieHandle.setFillOpacity("**", 0);
        module.lottieHandle.setStrokeOpacity("**", 0);
        if(type == "Fill") module.lottieHandle.setFillOpacity(keypath + ".**", 100);
        else module.lottieHandle.setStrokeOpacity(keypath + ".**", 100);
    }
}