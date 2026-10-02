import { Global, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthRegistryService } from './health-registry.service.js';
import { HealthController } from './health.controller.js';

@Global()
@Module({
  controllers: [HealthController],
  exports: [HealthRegistryService],
  imports: [TerminusModule],
  providers: [HealthRegistryService],
})
export class HealthModule {}
