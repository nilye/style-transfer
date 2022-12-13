import { parseXml } from '../util/parseXml';
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

    const result = this.service.wx.verifyServer(ctx.query);

    if (result) {
      ctx.body = ctx.query.echostr;
      ctx.status = 200;
      return;
    }
    return this.badRequest();
  }

  public async receiveWxEvent() {
    const { ctx } = this;
    const body = await parseXml(ctx.request.body);

    const { MsgType, Event, EventKey } = body;
    if (MsgType === 'event' && (Event === 'subscribe' || Event === 'SCAN')) {
      let replyXml = this.service.wx.replyWelcomeMessage(body);
      if (EventKey && EventKey.startsWith('qrscene')) {
        body.EventKey = body.EventKey.slice(8);
        replyXml = this.service.wx.replyAiImageMessage(body);
      }
      if (replyXml) {
        ctx.body = replyXml;
        ctx.status = 200;
        ctx.set('Content-Type', 'application/xml');
        return;
      }
    }

    ctx.body = '';
    ctx.status = 200;
  }
}
