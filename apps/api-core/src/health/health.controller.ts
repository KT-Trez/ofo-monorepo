import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller({ path: 'health', version: ['4'] })
export class HealthController {
  constructor(
    private readonly disk: DiskHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.5 }),
      () => this.memory.checkHeap('memory', 150 * 1024 * 1024),
      // todo: add YouTube health check
    ]);
  }
}
