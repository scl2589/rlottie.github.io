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

class LayerNode {
    constructor(keypath, name, type) {
        this.keypath = keypath;
        this.name = name;
        this.type = type;
        this.visible = true;
        this.selected = false;
        this.opacity = 100;
        this.xPos = 0;
        this.yPos = 0;
        this.scaleWidth = 100;
        this.scaleHeight = 100;
        this.rotation = 0;
        this.color = {
            alpha: Number(),
            hex: String(),
            hexa: String(),
            hsla: {
                h: Number(),
                s: Number(),
                l: Number(),
                a: Number(),
            },
            hsva: {
                h: Number(),
                s: Number(),
                v: Number(),
                a: Number(),
            },
            hue: Number(),
            rgba: {
                r: Number(),
                g: Number(),
                b: Number(),
                a: Number()
            }
        }
        this.child = []
    }
}

class RLottieModule {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.lottieHandle = new Module.RlottieWasm();
        this.frameCount = this.lottieHandle.frames();
        this.makeLayerTree();
        this.curFrame = 0;
    }

    render(speed) {
        if (this.canvas.width == 0 || this.canvas.height == 0) return;
        this.curFrame = Number(this.curFrame) + speed;
        var buffer = this.lottieHandle.render(this.curFrame, this.canvas.width, this.canvas.height);
        var result = Uint8ClampedArray.from(buffer);
        var imageData = new ImageData(result, this.canvas.width, this.canvas.height);
        this.context.putImageData(imageData, 0, 0);
    }

    makeLayerTree() {
        this.layerTree = new LayerNode("", "root", "");
        var fullLayers = [];
        var layer_vector = this.lottieHandle.allLayerTypeList();
        for(let i = 0; i < layer_vector.size(); i++) {
            fullLayers.push(layer_vector.get(i));
        }
        fullLayers.sort();
        fullLayers.forEach(element => {
            var layer = element.split(".");
            var type = "Stroke";
            if(layer[0] == "Fill Object:") type = "Fill";
            var curr = this.layerTree;
            var keypath = "";
            for(let i = 1; i < layer.length; i++) {
                if(i != 1) keypath += "."; 
                keypath += layer[i];
                let flag = false;
                for(let j = 0; j < curr.child.length; j++) {
                    if(curr.child[j].name != layer[i]) continue;
                    if(curr.child[j].type != type) continue;
                    curr = curr.child[j];
                    flag = true;
                }
                if(flag) continue;
                let node = new LayerNode(keypath, layer[i], type);
                curr.child.push(node);
                curr = node;
            }
        })
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
    jsString = "";
    curFrame = 0;
    isHover = false;
    searchList = [];

    constructor(size) {
        for (let i = 1; i <= size; i++) {
            this.rlotties.push(new RLottieModule("myCanvas" + i));
        }
        this.relayoutCanvas();
        this.slider = document.getElementById("slider");
        this.frameCount = document.getElementById("frameCount");
        this.currentFrame = document.getElementById("currentFrame");
        this.jsString = this.rlotties[0].lottieHandle.getDefaultLottie();

        frameCount.innerText = String(this.rlotties[0].frameCount);
        this.slider.max = this.rlotties[0].frameCount;
        console.log(this.rlotties[0].layerTree);
        app.$root.layers = this.rlotties[0].layerTree.child;
        app.$root.currentCanvas = this.rlotties[0].canvas;
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
        this.curFrame = this.rlotties[0].curFrame;
        currentFrame.innerText = String(Math.round(this.rlotties[0].curFrame - 1));
        slider.value = this.rlotties[0].curFrame;
    }

    reload(jsString) {
        this.rlotties.forEach(rm => {
            rm.lottieHandle.load(jsString);
            rm.frameCount = rm.lottieHandle.frames();
            rm.curFrame = 0;
            rm.makeLayerTree();
        });

        this.jsString = jsString;
        this.slider.max = this.rlotties[0].frameCount;
        this.slider.value = 0;
        this.frameCount = String(this.rlotties[0].frameCount);
        if (!this.playing) this.play();
    }

    // rlottieHandler.reset(this.canvasid);
    reset(idx) {
        var rm = this.rlotties[idx];
        rm.lottieHandle.load(this.jsString);
        rm.curFrame = this.curFrame;
        if(!this.playing) this.play();
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

function getSearchItem() {
    dfs(rlottieHandler.rlotties[0].layerTree);
    rlottieHandler.searchList.shift();
    return rlottieHandler.searchList;
}

function dfs(node, items) {
    rlottieHandler.searchList.push(node.keypath);
    for(let i = 0; i < node.child.length; i++) {
        dfs(node.child[i]);
    }
}

function updater() {
    rlottieHandler.rafId = window.requestAnimationFrame(updater);
    rlottieHandler.render();
}

function play() {
    document.getElementById("playButton").innerHTML = "<i class='fas fa-pause' style='color:#979797'></i>";
    rlottieHandler.play();
}

function pause() {
    document.getElementById("playButton").innerHTML = "<i class='fas fa-play' style='color:#979797'></i>";
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
    if(rlottieHandler.isHover) return;
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
    return lottieModule.layerTree;
}

function setLayerColor(keypath, r, g, b, canvasid, type) {
    if(type == "Fill") rlottieHandler.rlotties[canvasid].lottieHandle.setFillColor(keypath, r, g, b);
    else if(type == "Stroke") rlottieHandler.rlotties[canvasid].lottieHandle.setStrokeColor(keypath, r, g, b);
}

function setLayerOpacity(keypath, opacity, canvasid, type) {
    if(type == "Fill") rlottieHandler.rlotties[canvasid].lottieHandle.setFillOpacity(keypath, opacity);
    else if(type == "Stroke") rlottieHandler.rlotties[canvasid].lottieHandle.setStrokeOpacity(keypath, opacity);
}

function setStrokeWidth(keypath, width, canvasid) {
    rlottieHandler.rlotties[canvasid].lottieHandle.setStrokeWidth(keypath, width);
}

function setPosition(keypath, x, y, canvasid) {
    rlottieHandler.rlotties[canvasid].lottieHandle.setPosition(keypath, x, y);
}

function setScale(keypath, width, height, canvasid) {
    rlottieHandler.rlotties[canvasid].lottieHandle.setScale(keypath, width, height);
}

function setRotation(keypath, degree, canvasid) {
    rlottieHandler.rlotties[canvasid].lottieHandle.setRotation(keypath, degree);
}

function moveFrame(frame) {
    rlottieHandler.rlotties.forEach(rm => {
        rm.curFrame = frame;
    });
}

function setPlaySpeed(speed) {
    if(speed == 0) return 0;
    if(speed < 0) rlottieHandler.playDir = false;
    else rlottieHandler.playDir = true;
    rlottieHandler.playSpeed = speed;
}

function allLayerTypeList() {
    var layers = [];
    var alv = rlottieHandler.rlotties[0].lottieHandle.allLayerTypeList();
    for(let i=0;i<alv.size();i++) {
        console.log(alv.get(i));
    }
}