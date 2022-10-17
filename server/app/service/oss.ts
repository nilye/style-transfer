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

    // build canonical string
    const canonicalizedResource = `/${this.getOssBucketName()}/${resourcePath}`
    
    const signContent = [
      method.toUpperCase(),
      "",
      "",
      date,
      // CanonicalizedOSSHeaders - https://help.aliyun.com/document_detail/31978.html
      // "x-oss-tagging:kind=style-transfer",
      canonicalizedResource
    ]
    const stringToSign = signContent.join("\n")
  }
}