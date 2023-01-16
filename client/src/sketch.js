// import ml5 from "ml5";

import { default as P5 } from "p5";
import { drawReport } from "./report";
import request from "./request";

let p5Canvas;
let style;
let video;
let resultImg;
let modelLoaded = false;
let paused = false;
let logoImg;

let faceApi;
let faceApiModelLoaded = false;

function sketch(p) {
  p.setup = setup(p);
  p.draw = draw(p);
}
const w = 1280;
const h = 720;

function onWindowResize() {
  if (!p5Canvas.elt) return;
  const winWidth = window.innerWidth - 64;
  p5Canvas.elt.style.width = winWidth + "px";
  p5Canvas.elt.style.height = (winWidth / 16) * 9 + "px";
}
window.addEventListener("resize", onWindowResize);

const setup = (p) => () => {
  p5Canvas = p.createCanvas(w, h);
  p.frameRate(24);
  p5Canvas.drawingContext.save();
  onWindowResize();

  video = p.createCapture({
    audio: false,
    video: {
      width: 640,
      height: 360,
      frameRate: { ideal: 12, max: 16 },
    },
  });

  video.hide();
  video.elt.muted = true;
  video.elt.setAttribute("controls", "true");
  video.elt.setAttribute("muted", "");
  // debugger;

  originImg = p.createImg("");
  originImg.hide();
  resultImg = p.createImg("");
  resultImg.hide();
  logoImg = p.createImg("");
  logoImg.hide();
  logoImg.attribute("src", logoImageData);

  style = ml5.styleTransfer("models/udnie", video, () => {
    modelLoaded = true;
    setTimeout(() => {
      style.transfer(gotResult);
    }, 1000);
  });

  faceApi = ml5.faceApi(
    {
      withLandmarks: true,
      withDescriptors: false,
      Mobilenetv1Model: "models/faceapi",
      FaceLandmarkModel: "models/faceapi",
      FaceRecognitionModel: "models/faceapi",
      FaceExpressionModel: "models/faceapi",
    },
    () => {
      faceApiModelLoaded = true;
    }
  );
};

const draw = (p) => () => {
  if (paused) return;

  p.scale(-1, 1);
  if (modelLoaded) {
    p.image(modelLoaded ? resultImg : video, 0, 0, -w, h);
  } else {
    p.image(video, 0, 0, -w, h);
  }
};

function gotResult(err, img) {
  resultImg.attribute("src", img.src);
  setTimeout(() => {
    style.transfer(gotResult);
  }, 83);
}

const countdown = document.getElementById("countdown");
const qrcodeImg = document.getElementById("qrcode-img");
const qrcode = document.getElementById("qrcode");

let isCounting = false;

function detectFace() {
  return new Promise((resolve, reject) => {
    if (!faceApiModelLoaded) return reject();
    const canvas = document.createElement("canvas");
    canvas.height = video.height;
    canvas.width = video.width;
    // document.body.append(canvas);
    canvas
      .getContext("2d")
      .drawImage(video.elt, 0, 0, video.width, video.height);
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        originImg.attribute("src", e.target.result);
        faceApi.detect(originImg, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      };
      reader.readAsDataURL(blob);
    });
  });
}

const loader = document.querySelector(".loading");
function toggleLoader(toggle = true) {
  loader.style.display = toggle ? "flex" : "none";
}

async function takeImage(e) {
  if (!modelLoaded || isCounting || e.code !== "Space") return;

  let sec = 3;
  isCounting = true;
  countdown.textContent = 3;
  countdown.style.display = "block";
  qrcode.style.display = "none";
  qrcodeImg.setAttribute("src", "");

  const interval = setInterval(() => {
    countdown.textContent = --sec;
  }, 1000);

  let uploadData;
  try {
    uploadData = await request.createUpload();
  } catch (err) {
    console.log("cannot reach server");
  }
  if (!uploadData) {
    console.log(uploadData);
    clearInterval(interval);
    countdown.style.display = "none";
    return;
  }

  setTimeout(async () => {
    clearInterval(interval);
    paused = true;
    countdown.style.display = "none";
    toggleLoader(true);

    let people = 0;
    try {
      const result = await detectFace();
      console.log(result);
      people = result.length;
    } catch (err) {}
    console.log(people);
    drawLogo();
    drawReport(people, p5Canvas.canvas);

    await uploadImage(uploadData);

    toggleLoader(false);

    // pause after take image
    setTimeout(() => {
      isCounting = false;
      paused = false;
    }, 3000);
  }, 3000);
}

function uploadImage(uploadData) {
  const reportCanvas = document.getElementById("report-canvas");
  return new Promise((resolve) => {
    reportCanvas.toBlob(async (blob) => {
      try {
        await request.putImage(blob, uploadData);
        console.log("uploaded");
        const url = await request.getWxQrcode(uploadData.id);
        console.log("got qrcode", url);
        qrcodeImg.setAttribute("src", url);
        qrcode.style.display = "block";
      } catch (err) {
        console.error(err);
      }
      resolve();
    });
  });
}

document.addEventListener("keydown", hideQrcode);
function hideQrcode(e) {
  if (e.key === "c") {
    qrcode.style.display = "none";
  } else if (e.code === "Space") {
    takeImage(e);
  } else if (e.key === "f") {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  }
}

function drawLogo() {
  const ctx = p5Canvas.drawingContext;
  ctx.drawImage(logoImg.elt, 8, h - 37 - 8, 108, 37);
}

const logoImageData =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjUgMTEyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+PGcgaWQ9IkxheWVyXzUiIGRhdGEtbmFtZT0iTGF5ZXIgNSI+PHJlY3Qgd2lkdGg9IjMyNSIgaGVpZ2h0PSIxMTIiLz48cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iMjk4Ljk5IDI2LjUgMjM4Ljk5IDI2LjUgMjM3Ljk5IDI2LjUgMjM3Ljk5IDI3LjUgMjM3Ljk5IDM5LjUgMjM3Ljk5IDQwLjUgMjM4Ljk5IDQwLjUgMjk4Ljk5IDQwLjUgMjk5Ljk5IDQwLjUgMjk5Ljk5IDM5LjUgMjk5Ljk5IDI3LjUgMjk5Ljk5IDI2LjUgMjk4Ljk5IDI2LjUiLz48cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iMjc4Ljk5IDYzLjgzIDI3OS45OSA2My44MyAyNzkuOTkgNjIuODMgMjc5Ljk5IDUwLjgzIDI3OS45OSA0OS44MyAyNzguOTkgNDkuODMgMjM4Ljk5IDQ5LjgzIDIzNy45OSA0OS44MyAyMzcuOTkgNTAuODMgMjM3Ljk5IDYyLjgzIDIzNy45OSA2My44MyAyMzguOTkgNjMuODMgMjc4Ljk5IDYzLjgzIi8+PHBvbHlnb24gY2xhc3M9ImNscy0xIiBwb2ludHM9IjIzOC45OSA3NC41IDIzNy45OSA3NC41IDIzNy45OSA3NS41IDIzNy45OSA4Ny41IDIzNy45OSA4OC41IDIzOC45OSA4OC41IDI5OC45OSA4OC41IDI5OS45OSA4OC41IDI5OS45OSA4Ny41IDI5OS45OSA3NS41IDI5OS45OSA3NC41IDI5OC45OSA3NC41IDIzOC45OSA3NC41Ii8+PHBvbHlnb24gY2xhc3M9ImNscy0xIiBwb2ludHM9IjE4My40NCA3NC41IDE4My40NCAyNy41IDE4My40NCAyNi41IDE4Mi40NCAyNi41IDE3MC40NCAyNi41IDE2OS40NCAyNi41IDE2OS40NCAyNy41IDE2OS40NCA4Ny41IDE2OS40NCA4OC41IDE3MC40NCA4OC41IDIyMC40NCA4OC41IDIyMS40NCA4OC41IDIyMS40NCA4Ny41IDIyMS40NCA3NS41IDIyMS40NCA3NC41IDIyMC40NCA3NC41IDE4My40NCA3NC41Ii8+PHBvbHlnb24gY2xhc3M9ImNscy0xIiBwb2ludHM9IjI2LjM1IDI2LjUgMjUuMzUgMjYuNSAyNS4zNSAyNy41IDI1LjM1IDM5LjUgMjUuMzUgNDAuNSAyNi4zNSA0MC41IDQ5LjM1IDQwLjUgNDkuMzUgODcuNSA0OS4zNSA4OC41IDUwLjM1IDg4LjUgNjIuMzUgODguNSA2My4zNSA4OC41IDYzLjM1IDg3LjUgNjMuMzUgNDAuNSA4Ni4zNSA0MC41IDg3LjM1IDQwLjUgODcuMzUgMzkuNSA4Ny4zNSAyNy41IDg3LjM1IDI2LjUgODYuMzUgMjYuNSAyNi4zNSAyNi41Ii8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTI4LDI5YTQuNTgsNC41OCwwLDAsMC04LjE5LDBMOTMuMzksODEuODdhNC41OCw0LjU4LDAsMCwwLDQuMDksNi42M2g1Mi44M2E0LjU4LDQuNTgsMCwwLDAsNC4xLTYuNjNaIi8+PC9nPjwvZz48L3N2Zz4=";

export function init() {
  new P5(sketch, document.getElementById("container"));
}
