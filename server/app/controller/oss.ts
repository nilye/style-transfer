import Controller from "./base";

export default class OssController extends Controller {
  public async sign(){
    const { ctx, config } = this;
    ctx.validate({
      method: {
        type:"enum",
        required: true,
        values: ["PUT","POST", "GET"],
      },
      headers: {
        type: "object"
      },
      resourcePath: {
        type: "string",
        required: true,
        format: /^\//
      }
    })

    const { method, headers, resourcePath } = ctx.request.body

    // const {} = this.ctx.service.oss.signAuthorization(method,headers, resourcePath)
  }
}