import Controller from "./base";

const methodRule = {
  type:"enum",
  required: true,
  values: ["PUT","POST", "GET"],
}

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
        type: "object",
        required: false,
      },
      resourcePath: {
        type: "string",
        required: true,
        format: /^\//
      }
    })

    const { method, headers, resourcePath } = ctx.request.body

    const data = this.ctx.service.oss.signAuthorization(method,headers, resourcePath)

    this.success(data)
  }
}