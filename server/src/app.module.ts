import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { OssModule } from './modules/oss/oss.module';
import { WxModule } from './modules/wx/wx.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    OssModule,
    WxModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
