import { Module } from '@nestjs/common';
import { ServerInfoController } from './server-info.controller.js';
import { ServerInfoService } from './server-info.service.js';

@Module({
  controllers: [ServerInfoController],
  providers: [ServerInfoService],
})
export class ServerInfoModule {}
