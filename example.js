var rlottieHandler;
var mainRLottieModule;

function setup() {
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'rlottie-wasm.js';
    head.appendChild(script);
    
    script.onload = _ => {
        Module.onRuntimeInitialized = _ => {
            // addListener();
            rlottieHandler = new RLottieHandler();
            addListener();
            var updater = function() {
                rlottieHandler.rlotties[0].rafId = window.requestAnimationFrame(updater);
                rlottieHandler.render();
                mainRLottieModule = rlottieHandler.rlotties[0];
                document.getElementById("slider").max = mainRLottieModule.frameCount;
                document.getElementById("slider").value = mainRLottieModule.curFrame;
                document.getElementById("currentFrame").innerText = String(Math.round(mainRLottieModule.curFrame - 1));
            }
            window.requestAnimationFrame(updater);
        };
    };
}

setup();

class RLottieModule {
    layers = [];
    canvas = {};
    context = {};
    lottieHandle = 0;
    frameCount = 0;
    curFrame = 0;
    frameRate = 0;
    rafId = {};
    resizeId = {};
    playing = true;
    wasPlaying = false;
    playDir = true;
    playSpeed = 1;
    isBounce = false;
    isMain = false;

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.lottieHandle = new Module.RlottieWasm();
        this.frameCount = this.lottieHandle.frames();

        this.makeLayerList();
        this.relayoutCanvas();
    }
    render() {
        if(this.canvas.width == 0 || this.canvas.height == 0) return;
        this.curFrame = Number(this.curFrame) + this.playSpeed;
        var buffer = this.lottieHandle.render(this.curFrame, this.canvas.width, this.canvas.height);
        var result = Uint8ClampedArray.from(buffer);
        var imageData = new ImageData(result, this.canvas.width, this.canvas.height);
        
        this.context.putImageData(imageData, 0, 0);

        if(this.playDir && this.curFrame > this.frameCount) {
            if(this.isBounce) {
                this.playSpeed = -this.playSpeed;
                this.playDir = !this.playDir;
            }
            else {
                this.curFrame = 0;
            }
        }
        if(!this.playDir && this.curFrame <= 0) {
            if(this.isBounce) {
                this.playSpeed = -this.playSpeed;
                this.playDir = !this.playDir;
            }
            else {
                this.curFrame = this.frameCount;
            }
        }
        
        // document.getElementById("currentFrame").innerText = String(Math.round(this.curFrame - 1));
    }

    reload(jsString) {
        this.lottieHandle.load(jsString);
        this.frameCount = this.lottieHandle.frames();
        this.curFrame = 0;

        this.makeLayerList();
        sliderReset();
        this.update();
    }

    update() {
        document.getElementById("frameCount").innerText = String(this.frameCount);
        if(!this.playing){
            window.requestAnimationFrame(this.render);
        }
    }

    pause() {
        console.log("pause " + this.rafId);
        window.cancelAnimationFrame(this.rafId);
        this.playing = false;
    }

    play() {
        this.playing = true;    
    }

    isPlaying() {
        return this.playing;
    }

    seek(value) {
        this.curFrame = value;
        window.requestAnimationFrame(this.render);
    }

    relayoutCanvas() {
        console.log("relayout")
        var width = document.getElementById("player").clientWidth;
        var height = document.getElementById("player").clientHeight;
        var size = width < height ? width : height;
        size = size < 350 ? size - 100 : 250;

        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.width = size + "px";
        this.canvas.style.height = size + "px";
    }

    makeLayerList() {
        this.layers = [];
        var layers_vector = this.lottieHandle.layers();
        for(let i = 0; i < layers_vector.size(); i++) {
            var layer = layers_vector.get(i).split("/");
            this.layers.push({
                name: layer[0],
                inFrame: layer[1],
                outFrame: layer[2],
                visible: true,
                selected: false,
                opacity: 100,
                xPos: 0,
                yPos: 0,
                scaleWidth: 100,
                scaleHeight: 100,
                rotation: 0,
                color: {
                    alpha: Number(),
                    hex: String(),
                    hexa: String(),
                    hsla: {
                        h: Number(),
                        s: Number(),
                        l: Number(),
                        a: Number()
                    },
                    hsva: {
                        h: Number(),
                        s: Number(),
                        v: Number(),
                        a: Number()
                    },
                    hue: Number(),
                    rgba: {
                        r: Number(),
                        g: Number(),
                        b: Number(),
                        a: Number()
                    }
                }
            });
        }
        app.$root.layers = this.layers;
    }
}

class RLottieHandler {
    rlotties = [];
    isMultiView = false;

    constructor() {
        for(let i = 1; i <= 4; i++) {
            this.rlotties.push(new RLottieModule("myCanvas" + i));
        }
        document.getElementById("frameCount").innerText = String(this.rlotties[0].frameCount);
        app.$root.layers = this.rlotties[0].layers;
    }

    render() {
        console.log(this.rlotties.length);
        for(let i=0;i<this.rlotties.length;i++) {
            this.rlotties[i].render();
        }
    }
}


function addListener() {
    // var input = document.getElementById("fileSelector");
    // input.addEventListener("change", fileSelectionChanged);
    // window.addEventListener("dragover", handleDragOver, false);
    // window.addEventListener("drop", handleFileSelect, false);
    // window.addEventListener("resize", mainRLottieModule.windowResize);
}

function buttonClicked() {
    
}

function setFillColor(keypath, r, g, b, module) {
    module.lottieHandle.setFillColor(keypath, r, g, b);
}


// app.$root.layers = rlottieHandler.rlotties[0].layers;