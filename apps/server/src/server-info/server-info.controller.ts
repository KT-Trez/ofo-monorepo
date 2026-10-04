import { Controller, Get } from '@nestjs/common';
import type { GetServerInfoResponse, ServerControllerMethods } from '@ofo/server-contract';
import { AuthPublic } from '../auth/auth-public.decorator.ts';
import { ServerInfoService } from './server-info.service.js';

@Controller({ path: 'server', version: '4' })
export class ServerInfoController implements ServerControllerMethods {
  constructor(private readonly service: ServerInfoService) {}

  @AuthPublic()
  @Get()
  public getServerInfo(): Promise<GetServerInfoResponse> {
    return Promise.resolve(this.service.getServerInfo());
  }
}
