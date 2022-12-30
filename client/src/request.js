import Cookies from "js-cookie";

const headers = {
  "Content-Type": "application/json",
  Authorization: Cookies.get("token"),
};

function putImage(blob, options) {
  const { bucket, objectName, headers } = options;
  return fetch(`https://${bucket}.oss-cn-shanghai.aliyuncs.com/` + objectName, {
    method: "PUT",
    headers,
    body: blob,
  }).then();
}

function createUpload() {
  const controller = new AbortController();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      controller.abort();
      reject("timeout");
    }, 3000);

    fetch("/api/oss/createUpload", {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        contentType: "image/jpeg",
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json.data);
      });
  });
}

function getWxQrcode(objectName) {
  return fetch("/api/wx/qrcode", {
    method: "POST",
    headers,
    body: JSON.stringify({ objectName }),
  })
    .then((res) => res.json())
    .then((json) => json.data.url);
}

function login() {
  const bucket = window.bucket || "tale-style-transfer-dev";
  const client = window.client || "localhost";

  fetch("/api/auth/sign", {
    method: "POST",
    headers,
    body: JSON.stringify({
      bucket,
      client,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const token = data.data.token;
      Cookies.set("token", token, { httpOnly: false });
      headers.Authorization = token;
    });
}

(function init() {
  const token = Cookies.get("token");
  if (!token) {
    login();
  }
})();

//
window.login;

const request = {
  login,
  putImage,
  createUpload,
  getWxQrcode,
};

export default request;
