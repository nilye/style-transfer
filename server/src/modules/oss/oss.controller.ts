import { Body, Controller, Post } from '@nestjs/common';

import { CreateUploadDto } from './dto/createUpload.dto';
import { OssService } from './oss.service';

@Controller('oss')
export class OssController {
  constructor(private ossService: OssService) {}

  @Post('createUpload')
  async createUpload(@Body() body: CreateUploadDto) {
    return await this.ossService.createUpload(body.contentType);
  }
}
