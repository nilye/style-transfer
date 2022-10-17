import * as crypto from "crypto"
import { ossBucketName } from "src/constant"

export function nowUTCString(){
  return (new Date()).toUTCString()
}

export function signAuthorization(
  method: "PUT" | "GET",
  date: string,
  headers: AnyObject,
  resourcePath: string = ""
){
  
  const stringToSign = buildCanonicalString(method, date, headers, resourcePath)

  const accessKeyId = process.env.ACCESS_KEY_ID
  const accessKeySecret = process.env.ACCESS_KEY_SECRET
  
  const sha = crypto.createHmac("sha1", accessKeySecret)
  const signature = sha.update(Buffer.from(stringToSign, "utf-8")).digest("base64")

  return `OSS ${accessKeyId}:${signature}`
}

/**
 * 关于签名计算
 * https://help.aliyun.com/document_detail/31951.html#section-rvv-dx2-xdb
 */
function buildCanonicalString(
  method: "PUT" | "GET",
  date: string,
  headers: AnyObject,
  resourcePath: string = ""
){
  
  const canonicalizedResource = `/${ossBucketName}/${resourcePath}`

  const signContent = [
    method.toUpperCase(),
    "",
    "",
    date,
    // CanonicalizedOSSHeaders - https://help.aliyun.com/document_detail/31978.html
    // "x-oss-tagging:kind=style-transfer",
    canonicalizedResource
  ]
  
  return signContent.join("\n")
}

