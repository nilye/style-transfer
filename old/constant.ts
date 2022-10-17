export const ossBucketName = ({
  development: "tale-style-transfer-dev",
  production: "tale-style-transfer"
})[process.env.NODE_ENV]