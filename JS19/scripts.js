const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video : true, audio : false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })

        .catch(err => {
            console.error("Oh nooooo !", err)
        })
}

function paintToCanvas () {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval (() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0,0, width, height); // extraire les pixels
        // pixels = redEffect(pixels); // jouer avec les pixels
        // pixels = rgbSplit(pixels); // jouer avec les pixels
        pixels = greenScreen(pixels);
        ctx.putImageData(pixels, 0 ,0 ); // les remettre
    }, 16);
}

function takePhoto () {
    // jouer le son
    snap.currentTime = 0;
    snap.play();

    //extraire la donnée du canvas
    const data = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download","handsome");
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for( let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i] = pixels.data[i] + 100; //red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for( let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i]; //red
        pixels.data[i + 100] = pixels.data[i + 1]; //green
        pixels.data[i - 150] = pixels.data[i + 2]; //blue
    }
    return pixels;
}

function greenScreen(pixels) {
    //27:26
    const levels = {};

    document.querySelectorAll(".rgb input").forEach((input) => {
        levels[input.name] = input.value;
    })

    for( let i = 0; i < pixels.data.length; i+=4) {
        red = pixels.data[i]; //red
        green = pixels.data[i + 1]; //green
        blue = pixels.data[i + 2]; //blue
        alpha = pixels.data[i + 3]; //alpha

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
                pixels.data[i + 3] = 0;
            }
    }
    return pixels;

}


getVideo();

video.addEventListener("canplay", paintToCanvas);