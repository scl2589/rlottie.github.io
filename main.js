(function () {
    // load the script depending on web worker support
    var src;
    if (typeof(Worker) !== "undefined") {
        srcs = ['module-rlottie.js', './gifjs/dist/gif.js', './gifjs/dist/gif.worker.js'];
    } else {
        srcs = ['module-rlottie.js', './gifjs/dist/gif.js', './gifjs/dist/gif.worker.js'];
    }
    var head = document.head;

    srcs.forEach(src => {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        head.appendChild(script);
    });
})();
