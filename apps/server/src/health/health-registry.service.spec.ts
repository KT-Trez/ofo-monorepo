import type { HealthIndicatorFunction } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { HealthRegistryService } from './health-registry.service.js';

describe('HealthRegistryService', async () => {
  const createRegistry = async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HealthRegistryService],
    }).compile();

    return moduleRef.get(HealthRegistryService);
  };

  it('should add a check to registry', async () => {
    // given
    const check = vi.fn<HealthIndicatorFunction>();

    const registry = await createRegistry();

    // when
    registry.register('check', check);

    // then
    expect(registry.list()).toEqual([check]);
  });

  it('should replace a check registered under the same key', async () => {
    // given
    const checkA = vi.fn<HealthIndicatorFunction>();
    const checkB = vi.fn<HealthIndicatorFunction>();

    const registry = await createRegistry();

    // when
    registry.register('check', checkA);
    registry.register('check', checkB);

    // then
    expect(registry.list()).toEqual([checkB]);
  });
});
