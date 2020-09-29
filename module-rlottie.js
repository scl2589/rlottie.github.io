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
            rlottieHandler = new RLottieHandler(4);
            addListener();
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

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.lottieHandle = new Module.RlottieWasm();
        this.frameCount = this.lottieHandle.frames();

        this.makeLayerList();
        // this.relayoutCanvas();
    }

    render(speed) {
        if (this.canvas.width == 0 || this.canvas.height == 0) return;
        this.curFrame = Number(this.curFrame) + speed;
        var buffer = this.lottieHandle.render(this.curFrame, this.canvas.width, this.canvas.height);
        var result = Uint8ClampedArray.from(buffer);
        var imageData = new ImageData(result, this.canvas.width, this.canvas.height);
        this.context.putImageData(imageData, 0, 0);
    }

    // relayoutCanvas() {
    //     var width = document.getElementById("player").clientWidth;
    //     var height = document.getElementById("player").clientHeight;
    //     var size = width < height ? width : height;
    //     // size = size < 350 ? size - 100 : 250;
    //     size = 500;

    //     this.canvas.width = size;
    //     this.canvas.height = size;
    //     this.canvas.style.width = size + "px";
    //     this.canvas.style.height = size + "px";
    // }

    makeLayerList() {
        this.layers = [];
        var layers_vector = this.lottieHandle.layers();
        for (let i = 0; i < layers_vector.size(); i++) {
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
    rafId = 0;
    resizeId = {};
    playing = true;
    wasPlaying = false;
    playDir = true;
    playSpeed = 1;
    isBounce = false;
    slider = {};
    frameCount = {};
    currentFrame = {};

    constructor(size) {
        for (let i = 1; i <= size; i++) {
            this.rlotties.push(new RLottieModule("myCanvas" + i));
        }
        this.relayoutCanvas();
        this.slider = document.getElementById("slider");
        this.frameCount = document.getElementById("frameCount");
        this.currentFrame = document.getElementById("currentFrame");

        frameCount.innerText = String(this.rlotties[0].frameCount);
        this.slider.max = this.rlotties[0].frameCount;
        app.$root.layers = this.rlotties[0].layers;
    }

    render() {
        var nextSpeed = this.playSpeed;
        var nextDir = this.playDir;
        var isMultiView = app.$root.isMultiView;
        for(let i = 0; i < this.rlotties.length; i++) {
            var rm = this.rlotties[i];
            rm.render(this.playSpeed);
            if(this.playDir && rm.curFrame > rm.frameCount) {
                if(this.isBounce) {
                    nextSpeed = -this.playSpeed;
                    nextDir = !this.playDir;
                }
                else rm.curFrame = 0;
            }
            if(!this.playDir && rm.curFrame <= 0) {
                if(this.isBounce) {
                    nextSpeed = -this.playSpeed;
                    nextDir = !this.playDir;
                }
                else rm.curFrame = rm.frameCount;
            }
            if(!isMultiView) break;
        }
        this.playSpeed = nextSpeed;
        this.playDir = nextDir;
        currentFrame.innerText = String(Math.round(this.rlotties[0].curFrame - 1));
        slider.value = this.rlotties[0].curFrame;
    }

    reload(jsString) {
        this.rlotties.forEach(rm => {
            rm.lottieHandle.load(jsString);
            rm.frameCount = rm.lottieHandle.frames();
            rm.curFrame = 0;
            rm.makeLayerList();
        });
        this.slider.max = this.rlotties[0].frameCount;
        this.slider.value = 0;
        this.frameCount = String(this.rlotties[0].frameCount);
        if (!this.playing) this.play();
    }

    pause() {
        window.cancelAnimationFrame(this.rafId);
        this.playing = false;
    }

    play() {
        this.playing = true;
        var curFrame = this.rlotties[0].curFrame;
        this.rlotties.forEach(rm => {
            rm.curFrame = curFrame;
        })
        this.rafId = window.requestAnimationFrame(updater);
    }

    seek(value) {
        this.rlotties.forEach(rlottie => {
            rlottie.curFrame = value;
        });
    }

    relayoutCanvas() {
        var width = document.getElementById("player").clientWidth;
        var height = document.getElementById("player").clientHeight;
        var maxSize = app.$root.isMultiView ? 350 : 600;
        var size = width < height ? width : height;
        if(app.$root.isMultiView) size /= 2;
        size = size < maxSize ? size - 100 : maxSize - 100;

        this.rlotties.forEach(rm => {
            rm.canvas.width = size;
            rm.canvas.height = size;
            rm.canvas.style.width = size + "px";
            rm.canvas.style.height = size + "px";
        });
    }
}

function updater() {
    rlottieHandler.rafId = window.requestAnimationFrame(updater);
    rlottieHandler.render();
}

function play() {
    rlottieHandler.play();
}

function pause() {
    rlottieHandler.pause();
}

function windowResize() {
    if(rlottieHandler.playing){
        rlottieHandler.wasPlaying = true;
        rlottieHandler.pause();
    }
    clearTimeout(rlottieHandler.resizeId);
    rlottieHandler.resizeId = setTimeout(() => {
        rlottieHandler.relayoutCanvas();
        if(rlottieHandler.wasPlaying) {
            rlottieHandler.wasPlaying = false;
        }
        rlottieHandler.play();
    }, 150);
}

function buttonClicked() {
    if (rlottieHandler.playing) {
        document.getElementById("playButton").innerHTML = "<i class='fas fa-play'></i>";
        rlottieHandler.pause();
    }
    else {
        document.getElementById("playButton").innerHTML = "<i class='fas fa-pause'></i>";
        rlottieHandler.play();
    }
}

function onSliderDrag(value) {
    rlottieHandler.seek(value);
}

function addListener() {
    var input = document.getElementById("fileSelector");
    input.addEventListener("change", fileSelectionChanged);
    window.addEventListener("dragover", handleDragOver, false);
    window.addEventListener("drop", handleFileSelect, false);
    window.addEventListener("resize", windowResize);
}

function fileSelectionChanged() {
    var input = document.getElementById("fileSelector");
    var contentName = document.getElementById('contentName')
    contentName.innerText = input.files[0].name.slice(0, -5)
    contentName.title = input.files[0].name.slice(0, -5)
    handleFiles(input.files);
}

function handleFiles(files) {
    for (let i = 0, f; f = files[i]; i++) {
        if (f.type.includes("json")) {
            var read = new FileReader();
            read.readAsText(f);
            read.onloadend = function () {
                rlottieHandler.reload(read.result);
            }
            break;
        }
    }
}

function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

function handleFileSelect(event) {
    event.stopPropagation();
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
}

function getLayerList(lottieModule) {
    return lottieModule.layers;
}

function setFillColor(keypath, r, g, b, lottieModule) {
    lottieModule.lottieHandle.setFillColor(keypath, r, g, b);
}

function setStrokeColor(keypath, r, g, b, lottieModule) {
    lottieModule.lottieHandle.setStrokeColor(keypath, r, g, b);
}

function setFillOpacity(keypath, opacity, lottieModule) {
    lottieModule.lottieHandle.setFillOpacity(keypath, opacity);
}

function setStrokeOpacity(keypath, opacity, lottieModule) {
    lottieModule.lottieHandle.setStrokeOpacity(keypath, opacity);
}

function setStrokeWidth(keypath, width, lottieModule) {
    lottieModule.lottieHandle.setStrokeWidth(keypath, width);
}

function setPosition(keypath, x, y, lottieModule) {
    lottieModule.lottieHandle.setPosition(keypath, x, y);
}

function setScale(keypath, width, height, lottieModule) {
    lottieModule.lottieHandle.setScale(keypath, width, height);
}

function setRotation(keypath, degree, lottieModule) {
    lottieModule.lottieHandle.setRotation(keypath, degree);
}

function moveFrame(frame) {
    rlottieHandler.rlotties.forEach(rm => {
        rm.curFrame = frame;
    })
}

function setPlaySpeed(speed) {
    if(speed == 0) return 0;
    if(speed < 0) rlottieHandler.playDir = false;
    else rlottieHandler.playDir = true;
    rlottieHandler.playSpeed = speed;
}