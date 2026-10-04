import { Injectable } from '@nestjs/common';
import type { HealthIndicatorFunction } from '@nestjs/terminus';

@Injectable()
export class HealthRegistryService {
  private readonly checks = new Map<string, HealthIndicatorFunction>();

  list(): HealthIndicatorFunction[] {
    return [...this.checks.values()];
  }

  register(key: string, check: HealthIndicatorFunction): void {
    this.checks.set(key, check);
  }
}
