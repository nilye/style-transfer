const reportText = [
  `任务档案第五百三十九号`,
  `TALE研究所`,
  `任务结果：成功`,
  `任务汇报：2022年12月10日，6名调查员进入由晶核能量构筑的001号不稳定循环空间，遭遇非本世界人型生物“廖君”。调查员进入空间4分15秒后与研究所失去联系，通信设备遭遇未知来源的电磁波干扰，53分20秒恢复通信，75分32秒后完成任务回到本世界，并成功带出空间中的晶核碎片。`,
  `后续研究结论：晶核碎片被取出后，空间开始塌缩。5分20秒后，空间内的生物生命体征消失，电磁波动亦停止，7分14秒后，空间塌缩到直径10微米，在后续的观察中，空间已无存在迹象。`,
  `调查员影像记录`,
];

const ctx = document.getElementById("report-canvas").getContext("2d");
ctx.font = "32px qiji";
ctx.fillStyle = "#000000";
ctx.textBaseline = "ideographic";

function drawText(text = "", x = 0, y = 0, textAlign) {
  const textMetrics = ctx.measureText(text);
  const lineHeight = textMetrics.fontBoundingBoxAscent;
  console.log(ctx, textMetrics, lineHeight);
  if (textAlign === "right") {
    x = x - textMetrics.width;
  }
  ctx.fillText(text, x, y + lineHeight);
  //https://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
}

function drawMultiLines(text = "", x = 0, y = 0, fitWidth) {
  fitWidth = fitWidth || 0;
  if (fitWidth <= 0) return;
  for (let i = 1; i <= text.length; i++) {
    let str = text.substring(0, i);
    const textMetrics = ctx.measureText(str);
    let lineHeight = textMetrics.fontBoundingBoxAscent;
    if (textMetrics.width > fitWidth) {
      let end = i - 1;
      if (str.endsWith("，")) end = i;
      ctx.fillText(text.substring(0, end), x, y);
      drawMultiLines(text.substring(end), x, y + lineHeight, fitWidth);
      return;
    }
  }
  ctx.fillText(text, x, y);
}

function dividerLine(y) {
  ctx.beginPath();
  ctx.moveTo(36, y);
  ctx.lineTo(ctx.canvas.width - 36, y);
  ctx.stroke();
}

function draw() {
  let height = 36;
  let padding = 36;
  drawText(reportText[0], padding, height);
  drawText(reportText[1], ctx.canvas.width - padding, height, "right");
  dividerLine((height += 60));
  drawText(reportText[2], padding, (height += 24));
  drawMultiLines(
    reportText[3],
    padding,
    (height += 48 + 36),
    ctx.canvas.width - padding * 2
  );
  drawMultiLines(
    reportText[4],
    padding,
    (height += 24 + 36 * 4),
    ctx.canvas.width - padding * 2
  );
}

let fontLoaded = false;
document.fonts.load("36px qiji");
document.fonts.onloadingdone = (event) => {
  if (event?.fontfaces[0]?.family === "qiji") {
    fontLoaded = true;
    draw();
  }
};
