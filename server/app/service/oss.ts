import * as crypto from "crypto"
import { Service } from "egg"

export default class OssService extends Service {

  private getOssBucketName(){
    console.log(this.config)
    return ({
      dev: "tale-style-transfer-dev",
      prod: "tale-style-transfer"
    })[this.config.env]
  }
  
  /**
   * 签名计算
   * https://help.aliyun.com/document_detail/31951.html#section-rvv-dx2-xdb
   */
  signAuthorization(
    method: string = "PUT",
    headers: AnyObject = {},
    resourcePath: string = ""
  ){
    
    const date = (new Date()).toUTCString()
    const stringToSign = this.buildCanonicalString(
      method,
      date,
      headers,
      resourcePath
    )

    const accessKeyId = this.config.ACCESS_KEY_ID
    const accessKeySecret = this.config.ACCESS_KEY_SECRET

    
    const sha = crypto.createHmac("sha1", accessKeySecret)
    const signature = sha.update(Buffer.from(stringToSign, "utf-8")).digest("base64")

    return {
      authroization: `OSS ${accessKeyId}:${signature}`,
      date
    }
  }

  buildCanonicalString(
    method: string,
    date: string,
    headers: AnyObject = {},
    resourcePath: string = ""
  ){

    const headersToSign = {}
    Object.keys(headers).forEach(key => {
      const lowerCaseKey = key.toLowerCase()
      if(lowerCaseKey.startsWith("x-oss-")){
        headersToSign[lowerCaseKey] = String(headers[key]).trim()
      }
    })
    const ossHeaders = Object.keys(headersToSign).sort().map((key) => {
      return key + ":" + headersToSign[key]
    })

    // build canonical string
    const canonicalizedResource = `/${this.getOssBucketName()}/${resourcePath}`
    
    const signContent = [
      method.toUpperCase(),
      "",
      "",
      date,
      // CanonicalizedOSSHeaders - https://help.aliyun.com/document_detail/31978.html
      ...ossHeaders,
      canonicalizedResource
    ]

    return signContent.join("\n")
  }
}