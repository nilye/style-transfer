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
        console.log(res);
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

    return await wxApi.post('/cgi-bin/qrcode/create', {
      expire_seconds: 2592000,
      action_name: 'QR_STR_SCENE',
      action_info: {
        scene: {
          // st (style-transfer) + : + objectId
          scene_str: 'st:' + objectId,
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

}
