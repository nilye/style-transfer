const reportText = [
  `任务档案第五百三十九号`,
  `TALE研究所`,
  `任务结果：成功`,
  `任务汇报：$Date，$Number名调查员进入由晶核能量构筑的零零一号不稳定循环空间，遭遇非本世界人型生物“廖君”。调查员进入空间四分十五秒后与研究所失去联系，通信设备遭遇未知来源的电磁波干扰，五十三分二十秒恢复通信，七十五分三十二秒后完成任务回到本世界，并成功带出空间中的晶核碎片。`,
  `后续研究结论：晶核碎片被取出后，空间开始塌缩。五分二十秒后，空间内的生物生命体征消失，电磁波动亦停止，七分十四秒后，空间塌缩到直径十微米，在后续的观察中，空间已无存在迹象。`,
  `调查员影像记录：`,
];

let ctx;
let fontLoaded = false;
document.fonts.load("36px qiji");
document.fonts.onloadingdone = (event) => {
  if (event?.fontfaces[0]?.family === "qiji") {
    fontLoaded = true;
    // drawReport(2);
  }
};

function drawText(text = "", x = 0, y = 0, { textAlign, fontSize } = {}) {
  fontSize = fontSize || 30;
  ctx.font = fontSize + "px qiji";
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "ideographic";

  const textMetrics = ctx.measureText(text);
  const lineHeight = textMetrics.fontBoundingBoxAscent;
  if (textAlign === "right") {
    x = x - textMetrics.width;
  }
  ctx.fillText(text, x, y + lineHeight);
  //https://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
}

function drawMultiLines(text = "", x = 0, y = 0, fitWidth) {
  ctx.font = "30px qiji";
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "ideographic";

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
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "#333333";
  ctx.stroke();
}

function getDate() {
  const zhNum = "零一二三四五六七八九十".split("");
  const date = new Date();
  const year = String(date.getFullYear())
    .split("")
    .map((char) => zhNum[char])
    .join("");
  const rawMonth = date.getMonth() + 1;
  const month =
    rawMonth <= 10 ? zhNum[rawMonth] : zhNum[10] + zhNum[String(rawMonth)[1]];

  const rawDay = date.getDate();
  zhNum[0] = "";
  const day =
    rawDay <= 10
      ? zhNum[rawDay]
      : rawDay < 20
      ? "十" + zhNum[String(rawDay)[1]]
      : rawDay < 30
      ? "二十" + zhNum[String(rawDay)[1]]
      : "三十" + zhNum[String(rawDay)[1]];

  return year + "年" + month + "月" + day + "日";
}

function getNumberOfPeople(num) {
  if (typeof num !== "number" || num === 0 || !num) return "多";
  return num;
}

export function drawReport(numberOfPeople, imageCanvas) {
  if (!fontLoaded) return;
  const canvas = document.getElementById("report-canvas");
  ctx = canvas.getContext("2d");
  console.log(ctx);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const backgroundImg = document.getElementById("report-bg-img");
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  let height = 48;
  let padding = 36;
  let widthWithPadding = ctx.canvas.width - padding * 2;
  drawText(reportText[0], padding, height, { fontSize: 24 });
  drawText(reportText[1], ctx.canvas.width - padding, height, {
    textAlign: "right",
    fontSize: 24,
  });
  dividerLine((height += 48));
  drawText(reportText[2], padding, (height += 24));
  drawMultiLines(
    reportText[3]
      .replace("$Date", getDate())
      .replace("$Number", getNumberOfPeople(numberOfPeople)),
    padding,
    (height += 48 + 36),
    widthWithPadding
  );
  drawMultiLines(
    reportText[4],
    padding,
    (height += 24 + 36 * 4),
    widthWithPadding
  );
  drawText(reportText[5], padding, (height += 24 + 36 * 2));

  const imageRatio = imageCanvas.height / imageCanvas.width;
  ctx.drawImage(
    imageCanvas,
    36,
    (height += 24 + 36),
    widthWithPadding,
    widthWithPadding * imageRatio
  );

  ctx.restore();
}
