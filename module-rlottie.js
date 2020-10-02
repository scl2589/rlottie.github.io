var rlottieHandler;
var thumbnailHandler;
var mainRLottieModule;
var layerNodeSize = 0;

function setup() {
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'rlottie-wasm.js';
    head.appendChild(script);

    script.onload = _ => {
        Module.onRuntimeInitialized = _ => {
            rlottieHandler = new RLottieHandler(4);
            setTimeout(() => {
                thumbnailHandler = new ThumbnailHandler(rlottieHandler.rlotties[0].layerTree.child, rlottieHandler.jsString);
            }, 500);
            addListener();
            window.requestAnimationFrame(updater);

        };
    };
}

setup();

class LayerNode {
    constructor(keypath, name, type, id, commonId) {
        this.id = id;
        this.commonId = commonId;
        this.keypath = keypath;
        this.name = name;
        this.type = type;
        this.visible = true;
        this.selected = false;
        this.opacity = 100;
        this.beforeOpacity = 100;
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
        this.canvasStyle = {
            backgroundColor: {
                alpha: 1,
                hex: "#FFFFFF",
                hexa: "#FFFFFF00",
                hsla: {
                    h: 1,
                    s: 0,
                    l: 0.7450980392156863,
                    a: 0,
                },
                hsva: {
                    h: 1,
                    s: 0,
                    v: 0,
                    a: 0.7450980392156863,
                },
                hue: 0,
                rgba: {
                    r: 190,
                    g: 190,
                    b: 190,
                    a: 1
                }
            },
            borderColor: {
                alpha: 0,
                hex: "#BEBEBE",
                hexa: "#BEBEBEFF",
                hsla: {
                    h: 0,
                    s: 0,
                    l: 0,
                    a: 0,
                },
                hsva: {
                    h: 0,
                    s: 0,
                    v: 0,
                    a: 0,
                },
                hue: 0,
                rgba: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                }
            },
            borderWidth: '1',
            width: '',
            height: '',
            borderShape: 0
        }

        this.context = this.canvas.getContext("2d");
        this.lottieHandle = new Module.RlottieWasm();
        this.frameCount = this.lottieHandle.frames();
        this.makeLayerTree();
        this.curFrame = 0;
    }

    makeGifFile(filename) {
        var gif = new GIF({
            workers: 10,
            quality: 1
        });

        console.log(this.canvasStyle.backgroundColor.rgba);

        for (let i = 0; i <= this.frameCount; i++) {
            let buffer = this.lottieHandle.render(i, this.canvas.width, this.canvas.height);
            let result = Uint8ClampedArray.from(buffer);
            let imageData = new ImageData(result, this.canvas.width, this.canvas.height);

            for (let k = 0; k < imageData.data.length; k+=4) {
                if (imageData.data[k+0]+imageData.data[k+1]+imageData.data[k+2] != 0) continue;

                // background color
                imageData.data[k+0] = this.canvasStyle.backgroundColor.rgba.r;
                imageData.data[k+1] = this.canvasStyle.backgroundColor.rgba.g;
                imageData.data[k+2] = this.canvasStyle.backgroundColor.rgba.b;
                imageData.data[k+3] = this.canvasStyle.backgroundColor.rgba.a;
            }

            gif.addFrame(imageData, {delay: 1000/60});
        }

        gif.on('finished', function(blob) {
            // window.open(URL.createObjectURL(blob));

            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            // filename
            a.download = filename;
            document.body.appendChild(a);
            a.click();
        });

        gif.render();
    }

    render(speed) {
        if (this.canvas.width == 0 || this.canvas.height == 0) return;
        this.curFrame = Number(this.curFrame) + speed;
        var buffer = this.lottieHandle.render(this.curFrame, this.canvas.width, this.canvas.height);
        var result = Uint8ClampedArray.from(buffer);
        var imageData = new ImageData(result, this.canvas.width, this.canvas.height);
        this.context.putImageData(imageData, 0, 0);
    }

    snapshot() {
        if (this.canvas.width == 0 || this.canvas.height == 0) return;
        app.$root.snapshotURL = this.canvas.toDataURL()
    }

    makeLayerTree() {
        this.layerTree = new LayerNode("**", "root", "", layerNodeSize++, 0);
        var fullLayers = [];
        var layer_vector = this.lottieHandle.allLayerTypeList();
        for(let i = 0; i < layer_vector.size(); i++) {
            fullLayers.push(layer_vector.get(i));
        }
        fullLayers.sort();
        var commonId = 1;
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
                let node = new LayerNode(keypath, layer[i], type, layerNodeSize++, commonId++);
                curr.child.push(node);
                curr = node;
            }
        })
        this.layerTree.child.allVisibility = true
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
    mainCanvasId = 0;

    constructor(size) {
        layerNodeSize = 0;
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

        app.$root.layers = this.rlotties[0].layerTree.child;
        app.$root.selectedCanvas = this.rlotties[0].canvas;
        app.$root.selectedCanvasStyle = this.rlotties[0].canvasStyle;
    }

    render() {
        var nextSpeed = this.playSpeed;
        var nextDir = this.playDir;
        var isMultiView = app.$root.isMultiView;
        for(let i = 0; i < this.rlotties.length; i++) {
            var rm = this.rlotties[i];
            if(!isMultiView && i != this.mainCanvasId) continue;
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
        }
        this.playSpeed = nextSpeed;
        this.playDir = nextDir;
        this.curFrame = this.rlotties[this.mainCanvasId].curFrame;
        currentFrame.innerText = String(Math.round(this.rlotties[this.mainCanvasId].curFrame - 1));
        slider.value = this.rlotties[this.mainCanvasId].curFrame;
    }

    reload(jsString) {
        layerNodeSize = 0;
        this.rlotties.forEach(rm => {
            rm.lottieHandle.load(jsString);
            rm.frameCount = rm.lottieHandle.frames();
            var newFrameCount = document.getElementById("frameCount");
            newFrameCount.innerText = String(rm.frameCount);
            rm.curFrame = 0;
            rm.makeLayerTree();
            rm.canvasStyle = {
                backgroundColor: {
                    alpha: 1,
                    hex: "#FFFFFF",
                    hexa: "#FFFFFF00",
                    hsla: {
                        h: 1,
                        s: 0,
                        l: 0.7450980392156863,
                        a: 0,
                    },
                    hsva: {
                        h: 1,
                        s: 0,
                        v: 0,
                        a: 0.7450980392156863,
                    },
                    hue: 0,
                    rgba: {
                        r: 190,
                        g: 190,
                        b: 190,
                        a: 1
                    }
                },
                borderColor: {
                    alpha: 0,
                    hex: "#BEBEBE",
                    hexa: "#BEBEBEFF",
                    hsla: {
                        h: 0,
                        s: 0,
                        l: 0,
                        a: 0,
                    },
                    hsva: {
                        h: 0,
                        s: 0,
                        v: 0,
                        a: 0,
                    },
                    hue: 0,
                    rgba: {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0
                    }
                },
                borderWidth: '1',
                width: "",
                height: "",
                borderShape: 0
            };
            rm.canvas.style.backgroundColor = rm.canvasStyle.backgroundColor.hex
            rm.canvas.style.borderColor = rm.canvasStyle.borderColor.hex
            rm.canvas.style.borderWidth = rm.canvasStyle.borderWidth + "px"
            rm.canvas.style.borderRadius = 0
            this.relayoutCanvas()
        });

        this.jsString = jsString;
        this.slider.max = this.rlotties[0].frameCount;
        this.slider.value = 0;
        this.frameCount = String(this.rlotties[0].frameCount);
        
        app.$root.layers = this.rlotties[0].layerTree.child;
        app.$root.selectedCanvas = this.rlotties[0].canvas;
        app.$root.selectedCanvasStyle = this.rlotties[0].canvasStyle;
        app.$root.selectedCanvasId = 0;
        rlottieHandler.mainCanvasId = 0;
        app.$root.selectedLayerTrigger = !app.$root.selectedLayerTrigger;
        app.$root.selectedLayer = null;
        thumbnailHandler.reload(this.rlotties[0].layerTree.child, this.jsString);

        if (!this.playing) this.play();
    }

    reset(idx) {
        var rm = this.rlotties[idx];
        rm.lottieHandle.load(this.jsString);
        rm.curFrame = this.curFrame;
        rm.canvasStyle = {
            backgroundColor: {
                alpha: 1,
                hex: "#FFFFFF",
                hexa: "#FFFFFF00",
                hsla: {
                    h: 1,
                    s: 0,
                    l: 0.7450980392156863,
                    a: 0,
                },
                hsva: {
                    h: 1,
                    s: 0,
                    v: 0,
                    a: 0.7450980392156863,
                },
                hue: 0,
                rgba: {
                    r: 190,
                    g: 190,
                    b: 190,
                    a: 1
                }
            },
            borderColor: {
                alpha: 0,
                hex: "#BEBEBE",
                hexa: "#BEBEBEFF",
                hsla: {
                    h: 0,
                    s: 0,
                    l: 0,
                    a: 0,
                },
                hsva: {
                    h: 0,
                    s: 0,
                    v: 0,
                    a: 0,
                },
                hue: 0,
                rgba: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                }
            },
            borderWidth: '1',
            width: "",
            height: "",
            borderShape: 0
        };
        rm.canvas.style.backgroundColor = rm.canvasStyle.backgroundColor.hex
        rm.canvas.style.borderColor = rm.canvasStyle.borderColor.hex
        rm.canvas.style.borderWidth = rm.canvasStyle.borderWidth + "px"
        rm.canvas.style.borderRadius = 0
        this.relayoutCanvas()
        app.$root.selectedCanvasStyle = rm.canvasStyle

        rm.makeLayerTree();
        app.$root.layers = rm.layerTree.child;
        setTimeout(() => {
        thumbnailHandler.setModuleCanvas(rm.layerTree.child);
        }, 100);
        if(!this.playing) this.play();
    }

    pause() {
        window.cancelAnimationFrame(this.rafId);
        this.playing = false;
    }

    play() {
        this.playing = true;
        var curFrame = this.rlotties[this.mainCanvasId].curFrame;
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
        var playbarHeight = document.getElementById("playbar").clientHeight;
        var extrtoolbarHeight = document.getElementById("collapseExtraTools").clientHeight
        
        height = height - playbarHeight - extrtoolbarHeight;
        width = width / 4 * 3;
        height = height / 4 * 3;

        var maxSize = width < height ? width : height;
        var size = width < height ? width : height;
        if(typeof (app.$root.isMultiView) !== "undefined") {
            maxSize = app.$root.isMultiView ?  width : height;

            if(app.$root.isMultiView) size /= 2;
        }
        size = size < maxSize ? size : maxSize;
        // console.log(size);

        // if(!app.$root.isMultiView) {
        //     this.rlotties[this.mainCanvasId].canvas.width = size;
        //     this.rlotties[this.mainCanvasId].canvas.height = size;
        //     this.rlotties[this.mainCanvasId].canvas.style.width = size + "px";
        //     this.rlotties[this.mainCanvasId].canvas.style.height = size + "px";
        // }
        // else {
        // }
        this.rlotties.forEach(rm => {
            rm.canvas.width = size;
            rm.canvas.height = size;
            rm.canvas.style.width = size + "px";
            rm.canvas.style.height = size + "px";
        });
    }
}

function getSearchItem() {
    dfs(rlottieHandler.rlotties[rlottieHandler.mainCanvasId].layerTree);
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
    if(typeof (thumbnailHandler) !== "undefined") thumbnailHandler.render();
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
    contentName.innerText = input.files[0].name
    contentName.title = input.files[0].name
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
    var contentName = document.getElementById('contentName')
    contentName.innerText = event.dataTransfer.files[0].name
    contentName.title = event.dataTransfer.files[0].name
    handleFiles(event.dataTransfer.files);
}

function getLayerList(lottieModule) {
    return lottieModule.layerTree;
}

function setLayerColor(node, r, g, b, canvasid) {
    var keypath = node.keypath + ".**";
    if(node.type == "Fill") rlottieHandler.rlotties[canvasid].lottieHandle.setFillColor(keypath, r, g, b);
    else if(node.type == "Stroke") rlottieHandler.rlotties[canvasid].lottieHandle.setStrokeColor(keypath, r, g, b);
    propertiesCascading(node, [{ name: "color",  value: node.color }]);
}

function setLayerOpacity(node, opacity, canvasid) {
    var keypath = node.keypath + ".**";
    node.beforeOpacity = node.opacity;
    if(node.type == "Fill") rlottieHandler.rlotties[canvasid].lottieHandle.setFillOpacity(keypath, opacity);
    else if(node.type == "Stroke") rlottieHandler.rlotties[canvasid].lottieHandle.setStrokeOpacity(keypath, opacity);
    propertiesCascading(node, [{ name: "opacity", value: opacity }]);
}

function setPosition(node, x, y, canvasid) {
    var keypath = node.keypath + ".**";
    rlottieHandler.rlotties[canvasid].lottieHandle.setPosition(keypath, x, y);
    propertiesCascading(node, [{ name: "xPos", value: x }, { name: "yPos", value: y }]);
}

function setScale(node, width, height, canvasid) {
    var keypath = node.keypath + ".**";
    rlottieHandler.rlotties[canvasid].lottieHandle.setScale(keypath, width, height);
    propertiesCascading(node, [{ name: "scaleWidth", value: width }, { name: "scaleHeight", value: height }]);
}

function setRotation(node, degree, canvasid) {
    var keypath = node.keypath + ".**";
    rlottieHandler.rlotties[canvasid].lottieHandle.setRotation(keypath, degree);
    propertiesCascading(node, [{ name: "rotation", value: degree }]);
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

function propertiesCascading(node, properties) {
    properties.forEach(property => {
        node[property.name] = property.value;
    });
    for(let i = 0; i < node.child.length; i++) {
        propertiesCascading(node.child[i], properties);
    }
}

function allLayerTypeList() {
    var layers = [];
    var alv = rlottieHandler.rlotties[0].lottieHandle.allLayerTypeList();
    for(let i=0;i<alv.size();i++) {
        console.log(alv.get(i));
    }
}

function ccc(filename) {
    var a = new RLottieModule("myCanvas1");
    a.makeGifFile(filename);
}