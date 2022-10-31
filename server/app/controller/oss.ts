import Controller from './base';


export default class OssController extends Controller {
  public async sign() {
    const { ctx } = this;
    ctx.validate({
      method: {
        type: 'enum',
        required: true,
        values: [ 'PUT', 'POST', 'GET' ],
      },
      headers: {
        type: 'object',
        required: false,
      },
      resourcePath: {
        type: 'string',
        required: true,
        format: /^\//,
      },
    });

    const { method, headers, resourcePath } = ctx.request.body;

    const data = this.ctx.service.oss.signAuthorization({
      method, headers,
      resourcePath,
    });

    this.success(data);
  }

  public async createUpload() {
    const { ctx } = this;
    ctx.validate({
      contentMd5: 'string?',
      contentType: 'string?',
    });

    const { contentMd5, contentType } = ctx.request.body;
    const { bucket, client } = ctx.state.user;

    const data = this.ctx.service.oss.createUpload({
      contentMd5,
      contentType,
      bucket,
      client,
    });
    this.success(data);
  }
}
