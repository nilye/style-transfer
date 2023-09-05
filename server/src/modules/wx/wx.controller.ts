import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common';
import { parseXml } from 'src/common/util/parseXml';

import { CreateQrCodeDto } from './dto/createQrCode.dto';
import { WxService } from './wx.service';

@Controller('wx')
export class WxController {
  constructor(private wxService: WxService) {}

  @Post('qrcode')
  async stQrcode(@Body() body: CreateQrCodeDto) {
    const ticket = await this.wxService.getStQrcode(body.objectName);

    return {
      ticket,
      url: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket,
    };
  }

  @Get('callback')
  async verifyWxServer(@Query() query: any) {
    return this.wxService.verifyServer(query);
  }

  @Post('callback')
  @HttpCode(200)
  @Header('Content-Type', 'application/xml')
  async receiveWxEvent(@Body() body: any) {
    body = await parseXml(body);

    const { MsgType, Event, EventKey } = body;
    if (MsgType === 'event' && (Event === 'subscribe' || Event === 'SCAN')) {
      let replyXml = this.wxService.replyWelcomeMessage(body);
      if (EventKey) {
        const parsedEventKey = EventKey.startsWith('qrscene')
          ? EventKey.slice(8)
          : EventKey;
        body.EventKey = parsedEventKey;

        // style transfer
        if (parsedEventKey.startsWith('st')) {
          replyXml = this.wxService.replyAiImageMessage(body);
        }
      }
      if (replyXml) {
        return replyXml;
      }
    }

    return '';
  }
}
