import axios from 'axios';
import * as crypto from 'crypto';
import { Service } from 'egg';
import { getTimestamp } from '../util/timestamp';

const wxApi = axios.create({
  baseURL: 'https://api.weixin.qq.com/',
  timeout: 2000,
});
wxApi.interceptors.response.use(res => {
  if (!res.data.errcode || res.data.errcode === 0) {
    return res.data;
  }
  return Promise.reject(res.data);
});


export default class WxService extends Service {

  private accessToken = '';
  private accessTokenExpiresAt = 0;

  // 获取 acces token
  async getAccessToken() {

    if (getTimestamp() < this.accessTokenExpiresAt && this.accessToken) {
      return this.accessToken;
    }

    const appid = this.config.WX_APP_ID;
    const secret = this.config.WX_APP_SECRET;

    try {
      return await wxApi.get('/cgi-bin/token', {
        params: {
          grant_type: 'client_credential',
          appid,
          secret,
        },
      }).then((res: any) => {
        this.accessToken = res.access_token;
        this.accessTokenExpiresAt = getTimestamp() + res.expires_in - 2;
        return res.access_token;
      });
    } catch (err) {
      return this.accessToken;
    }
  }

  // 生成拍照图片二维码
  async getStQrcode(objectId: string) {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('wx not authorized');
    }

    const { bucket } = this.ctx.state.user;

    return await wxApi.post('/cgi-bin/qrcode/create', {
      expire_seconds: 2592000,
      action_name: 'QR_STR_SCENE',
      action_info: {
        scene: {
          // st (style-transfer) + : + objectId
          scene_str: `st:${bucket}:${objectId}`,
        },
      },
    }, {
      params: {
        access_token: token,
      },
    }).then((res: any) => {

      return res.ticket;
    });

  }

  // 验证微信服务器
  verifyServer(params: any) {
    const token = this.config.WX_CB_TOKEN;
    const { signature, timestamp, nonce } = params;
    const arr = [ nonce, token, timestamp ].sort();
    const str = arr.join('');
    const encrypted = crypto.createHash('sha1').update(str).digest('hex');
    return encrypted === signature;
  }

  // 带参二维码回复消息
  // https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_event_pushes.html#%E6%89%AB%E6%8F%8F%E5%B8%A6%E5%8F%82%E6%95%B0%E4%BA%8C%E7%BB%B4%E7%A0%81%E4%BA%8B%E4%BB%B6
  replyAiImageMessage(params: any) {
    const { ToUserName, FromUserName, EventKey } = params;
    const [ _, bucket, objectId ] = EventKey.split(':');

    let msg = 'TALE 专心打造实境沉浸式体验，拓展艺术与科技结合的边界❗\n首个主题【迷津】炸裂开启，神秘实验室招募调查员⚠️⚠️⚠️\n欢迎你的到来！';
    if (bucket && objectId) {
      msg = `<a target="_blank" href="https://style-transfer.nil.work/view?id=${objectId}&bucket=${bucket}">点击此处</a>获取你的调查报告影像记录`;
    }
    return `
      <xml>
        <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
        <CreateTime>${getTimestamp()}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${msg.trim()}]]></Content>
      </xml>
    `;
  }

  replyWelcomeMessage(params: any) {
    const { ToUserName, FromUserName } = params;

    const msg = 'TALE 专心打造实境沉浸式体验，拓展艺术与科技结合的边界❗\n首个主题【迷津】炸裂开启，神秘实验室招募调查员⚠️⚠️⚠️\n欢迎你的到来！';
    return `
    <xml>
      <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
      <CreateTime>${getTimestamp()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${msg.trim()}]]></Content>
    </xml>
  `;
  }


}
