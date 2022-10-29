import { init } from "./sketch";
import "./style.css";

init();

// const canvas = document.getElementById("imgCanvas");
// const ctx = canvas.getContext("2d");

// ctx.fillStyle = "black";
// ctx.fillRect(0, 0, 500, 500);
// ctx.fillStyle = "red";
// ctx.fillRect(30, 30, 40, 40);

// const btn = document.getElementById("btn");
// btn.addEventListener("click", onClick);

// async function onClick() {
//   const data = await requets.createUpload();
//   if (!data) return;
//   canvas.toBlob(
//     (blob) => {
//       requets.putImage(blob, data);
//     },
//     "image/jpeg",
//     1.0
//   );
// }
