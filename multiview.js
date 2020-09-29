function setup() {
  var head = document.head;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'rlottie-wasm.js';
  head.appendChild(script);

  script.onload = _ => {
    Module.onRuntimeInitialized = _ => {
      var entry = new MainEntry();
      var updater = function() {
          entry.render();
          window.requestAnimationFrame( updater );  // for subsequent frames
      };
      window.requestAnimationFrame( updater );
    };
  };
}


// setup();


class RLottieView {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.lottieHandle = new Module.RlottieWasm();
    console.log(this.lottieHandle);
    this.frameCount = this.lottieHandle.frames();
    this.curFrame = 0;
    this.render();
  }

  render() {
      if (this.canvas.width == 0  || this.canvas.height == 0) return;

      // console.log("render stage ");
      if (this.curFrame >= this.frameCount) this.curFrame = 0;
      var bufferPointer = this.lottieHandle.render(this.curFrame, 300, 300);
      var result = Uint8ClampedArray.from(bufferPointer);
      var imageData = new ImageData(result, 300, 300);
      this.context.putImageData(imageData, 0, 0);
      this.curFrame = this.curFrame + 1;
  }
}

class MainEntry {
  render() {
    // this.lottieView1.render();
    this.lottieView2.render();
    this.lottieView3.render();
    this.lottieView4.render();
  }

  constructor() {
    // this.lottieView1 = new RLottieView("myCanvas");
    this.lottieView2 = new RLottieView("myCanvas2");
    this.lottieView3 = new RLottieView("myCanvas3");
    this.lottieView4 = new RLottieView("myCanvas4");
  }
}
