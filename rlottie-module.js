class RLottieModule {
    constructor(canvasId, isThumbnail) {
        this.canvas = document.getElementById(canvasId);
        this.makeCanvasStyle();
        
        this.context = this.canvas.getContext("2d");
        this.lottieHandle = new Module.RlottieWasm();
        this.frameCount = this.lottieHandle.frames();
        this.makeLayerTree();
        this.curFrame = 0;

        if(isThumbnail) return;
        this.preview = document.getElementById(canvasId+'Preview');
        this.contextPreview = this.preview.getContext("2d");
    }

    render(speed) {
        if (this.canvas.width == 0 || this.canvas.height == 0) return;
        this.curFrame = Number(this.curFrame) + speed;
        var buffer = this.lottieHandle.render(this.curFrame - speed, this.canvas.width, this.canvas.height);
        var result = Uint8ClampedArray.from(buffer);
        var imageData = new ImageData(result, this.canvas.width, this.canvas.height);
        this.context.putImageData(imageData, 0, 0);
    }

    previewRender(frame) {
        if (this.preview.width == 0 || this.preview.height == 0) return;
        var bufferPreview = this.lottieHandle.render(frame, this.preview.width, this.preview.height);
        var resultPreview = Uint8ClampedArray.from(bufferPreview);
        var imageDataPreview = new ImageData(resultPreview, this.preview.width, this.preview.height);
        this.contextPreview.putImageData(imageDataPreview, 0, 0);
    }

    makeLayerTree() {
        this.layerTree = new LayerNode("**", "root", "", layerNodeSize++, 0);
        var full_layers = [];

        // get fill layers and append to full_layers
        let fill_layer_vector = this.lottieHandle.getFillLayers();
        for(let i = 0; i < fill_layer_vector.size(); i++) {
            let layer = fill_layer_vector.get(i);
            layer.type = "Fill";
            full_layers.push(layer);
        }
        
        // get stroke layers and append to full_layers
        let stroke_layer_vector = this.lottieHandle.getStrokeLayers();
        for(let i = 0; i < stroke_layer_vector.size(); i++) {
            let layer = stroke_layer_vector.get(i);
            layer.type = "Stroke";
            full_layers.push(layer);
        }
        
        // get transform properties and append to full_layers
        let transform_layer_vector = this.lottieHandle.getTransformLayers();
        for(let i = 0; i < transform_layer_vector.size(); i++) {
            let layer = transform_layer_vector.get(i);
            layer.type = "Transform";
            full_layers.push(layer);
        }

        let commonId = 1;
        full_layers.forEach(element => {
            let keypath_split = element.keypath.split("::");
            let type = element.type;
            var curr = this.layerTree;
            let keypath = "";
            for(let i = 0; i < keypath_split.length; i++) {
                keypath += "." + keypath_split[i];
                let is_path_exist = false;
                for(let j = 0; j < curr.child.length; j++) {
                    if(curr.child[j].name != keypath_split[i]) continue;
                    if(type != "Transform" && curr.child[j].type != type) curr.child[j].type = "both";
                    curr = curr.child[j];
                    is_path_exist = true;
                }
                if(is_path_exist) continue;
                if(type == "Transform") continue;
                let node = new LayerNode(keypath.substr(1, keypath.length), keypath_split[i], type, layerNodeSize++, commonId++);
                
                curr.child.push(node);
                curr = node;
            }
            if(type == "Transform") {
                curr.anchorX = element.anchorX;
                curr.anchorY = element.anchorY;
                curr.posX = element.posX;
                curr.posY = element.posY;
                curr.scaleWidth = 100;
                curr.scaleHeight = 100;
                curr.rotation = 0;
            }
            else {
                curr.color.hex = this.rbgToHex(element.red, element.green, element.blue);
                curr.color.rgba.r = element.red;
                curr.color.rgba.g = element.green;
                curr.color.rgba.b = element.blue;
            }
        })
        this.layerTree.child.allVisibility = true
    }
    
    makeCanvasStyle() {
        this.canvasStyle = {
            backgroundColor: {
                alpha: 1,
                hex: "#FFFFFF",
                hexa: "#FFFFFFFF",
                hsla: {
                    h: 0,
                    s: 0,
                    l: 1,
                    a: 1,
                },
                hsva: {
                    h: 0,
                    s: 0,
                    v: 1,
                    a: 1,
                },
                hue: 0,
                rgba: {
                    r: 255,
                    g: 255,
                    b: 255,
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
                    l: 0.7450980392156863,
                    a: 1,
                },
                hsva: {
                    h: 0,
                    s: 0,
                    v: 0.7450980392156863,
                    a: 1,
                },
                hue: 0,
                rgba: {
                    r: 190,
                    g: 190,
                    b: 190,
                    a: 1
                }
            },
            borderWidth: '1',
            width: '',
            height: '',
            borderShape: 0,
            degree: 0
        }
        this.canvas.style.backgroundColor = this.canvasStyle.backgroundColor.hex;
        this.canvas.style.borderColor = this.canvasStyle.borderColor.hex;
        this.canvas.style.borderWidth = this.canvasStyle.borderWidth + 'px';
        this.canvas.style.width = this.canvasStyle.width + "px";
        this.canvas.style.height = this.canvasStyle.height + "px";
        this.canvas.style.borderRadius = 0;
        this.canvas.style.transform = `rotate(${this.canvasStyle.degree}deg)`;

    }

    makeGifFile(filename, callback) {
        var gif = new GIF({
            workers: 10,
            quality: 1
        });

        for (let i = 0; i <= this.frameCount; i++) {
            let buffer = this.lottieHandle.render(i, this.canvas.width, this.canvas.height);
            let result = Uint8ClampedArray.from(buffer);
            let imageData = new ImageData(result, this.canvas.width, this.canvas.height);

            for (let k = 0; k < imageData.data.length; k += 4) {
                // if there is no background color, continue
                if (imageData.data[k + 0] + imageData.data[k + 1] + imageData.data[k + 2] +imageData.data[k + 3] != 0) continue;

                // background color
                imageData.data[k + 0] = this.canvasStyle.backgroundColor.rgba.r;
                imageData.data[k + 1] = this.canvasStyle.backgroundColor.rgba.g;
                imageData.data[k + 2] = this.canvasStyle.backgroundColor.rgba.b;
                imageData.data[k + 3] = this.canvasStyle.backgroundColor.rgba.a;
            }

            gif.addFrame(imageData, {delay: 1000 / 60});
        }

        gif.on('finished', blob => {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            callback();
        });

        gif.render();
    }

    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rbgToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)
    }
}