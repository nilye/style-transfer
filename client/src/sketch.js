// import ml5 from "ml5";

import { default as P5 } from "p5";
import request from "./request";

let p5Canvas;
let style;
let video;
let resultImg;
let modelLoaded = false;
let paused = false;

function sketch(p) {
  p.setup = setup(p);
  p.draw = draw(p);
}
const w = 960;
const h = 720;

const setup = (p) => () => {
  p5Canvas = p.createCanvas(w, h, "P2D");
  p.frameRate(24);

  video = p.createCapture("VIDEO");
  video.hide();
  video.elt.muted = true;
  video.elt.setAttribute("controls", "true");
  video.elt.setAttribute("muted", "");
  // debugger;

  resultImg = p.createImg("");
  resultImg.hide();

  style = ml5.styleTransfer("models/udnie", video, () => {
    modelLoaded = true;
    setTimeout(() => {
      style.transfer(gotResult);
    }, 1000);
  });
};

const draw = (p) => () => {
  if (paused) return;
  if (modelLoaded) {
    p.image(resultImg, 0, 0, w, h);
  } else {
    p.image(video, 0, 0, w, h);
  }
};

function gotResult(err, img) {
  resultImg.attribute("src", img.src);
  window.requestIdleCallback(() => {
    style.transfer(gotResult);
  });
}

export function init() {
  new P5(sketch, document.getElementById("container"));
}

const countdown = document.getElementById("countdown");
document.addEventListener("keydown", takeImage);

let isCounting = false;

async function takeImage(e) {
  if (!modelLoaded || isCounting || e.code !== "Space") return;

  let sec = 3;
  isCounting = true;
  countdown.textContent = 3;
  countdown.style.display = "block";
  const interval = setInterval(() => {
    countdown.textContent = --sec;
  }, 1000);

  let uploadData;
  try {
    uploadData = await request.createUpload();
  } catch (err) {
    alert("cannot reach server");
  }

  setTimeout(() => {
    clearInterval(interval);
    countdown.style.display = "none";
    paused = true;

    const canvasEl = p5Canvas.canvas;
    console.log(p5Canvas.canvas);
    canvasEl.toBlob((blob) => {
      request.putImage(blob, uploadData).then((res) => {
        console.log("uploaded", res);
      });
    });

    // pause after take image
    setTimeout(() => {
      isCounting = false;
      paused = false;
    }, 3000);
  }, 3000);
}
