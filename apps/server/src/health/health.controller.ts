import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../auth/public.decorator.js';
import { HealthRegistryService } from './health-registry.service.js';

@Public()
@Controller({ path: 'health', version: '4' })
export class HealthController {
  constructor(
    private readonly disk: DiskHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly registry: HealthRegistryService,
  ) {}

  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.95 }),
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      ...this.registry.list(),
    ]);
  }
}
