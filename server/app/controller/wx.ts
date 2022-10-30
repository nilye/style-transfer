import Controller from './base';

export default class WxController extends Controller {
  public async stQrcode() {
    const { ctx } = this;
    ctx.validate({
      objectName: 'string',
    });

    const { objectName } = ctx.request.body;

    const ticket = await this.ctx.service.wx.getStQrcode(objectName);
    this.success({
      ticket,
      url: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket,
    });

  }

  public async verifyWxServer() {
    const { ctx } = this;

    const result = this.service.wx.verifyServer(ctx.params);

    if (result) {
      ctx.body = ctx.params.echostr;
      ctx.status = 200;
      return;
    }
    return this.badRequest();
  }
}
