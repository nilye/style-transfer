const ctx = docuemnt.getElementById("report-canvas").getContext("2d");

export function drawText(text = "", x, y, maxW) {
  ctx.font = "20px qiji, serif";
  ctx.fillText(text, x, y, maxW);
}
