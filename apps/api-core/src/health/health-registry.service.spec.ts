import type { HealthIndicatorFunction } from '@nestjs/terminus';
import { describe, expect, it, vi } from 'vitest';
import { HealthRegistryService } from './health-registry.service.js';

describe('ReadinessRegistry', () => {
  it('should add a check to registry', () => {
    // given
    const check = vi.fn<HealthIndicatorFunction>();

    const registry = new HealthRegistryService();

    // when
    registry.register('check', check);

    // then
    expect(registry.list()).toEqual([check]);
  });

  it('should replace a check registered under the same key', () => {
    // given
    const checkA = vi.fn<HealthIndicatorFunction>();
    const checkB = vi.fn<HealthIndicatorFunction>();

    const registry = new HealthRegistryService();

    // when
    registry.register('check', checkA);
    registry.register('check', checkB);

    // then
    expect(registry.list()).toEqual([checkB]);
  });
});
