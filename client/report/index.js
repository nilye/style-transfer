const reportText = [
  `任务档案第五百三十九号`,
  `TALE研究所`,
  `任务结果：成功`,
  `任务汇报：2022年12月10日，6名调查员进入由晶核能量构筑的001号不稳定循环空间，遭遇非本世界人型生物“廖君”。调查员进入空间4分15秒后与研究所失去联系，通信设备遭遇未知来源的电磁波干扰，53分20秒恢复通信，75分32秒后完成任务回到本世界，并成功带出空间中的晶核碎片。`,
  `后续研究结论：晶核碎片被取出后，空间开始塌缩。5分20秒后，空间内的生物生命体征消失，电磁波动亦停止，7分14秒后，空间塌缩到直径10微米，在后续的观察中，空间已无存在迹象。`,
  `调查员影像记录
  `,
];

const ctx = document.getElementById("report-canvas").getContext("2d");

function drawText(text = "", x = 0, y = 0, multiLine = false) {
  ctx.font = "36px qiji";
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "ideographic";
  const textMetrics = ctx.measureText(text);
  const height = textMetrics.emHeightAscent;
  console.log(textMetrics, height);
  ctx.fillText(text, x, y);
  //https://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
}

function draw() {
  drawText(reportText[0], 24, 28);
}

let fontLoaded = false;
document.fonts.load("36px qiji");
document.fonts.onloadingdone = (event) => {
  if (event?.fontfaces[0]?.family === "qiji") {
    fontLoaded = true;
    draw();
  }
};
