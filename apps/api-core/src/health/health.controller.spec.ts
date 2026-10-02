import {
  DiskHealthIndicator,
  HealthCheckService,
  type HealthIndicatorFunction,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HealthRegistryService } from './health-registry.service.js';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  const checkCustomMock = vi.fn<HealthIndicatorFunction>();
  const checkMock = vi
    .fn<(fns: unknown[]) => Promise<unknown>>()
    .mockResolvedValue({ status: 'ok' });

  let controller: HealthController;
  let registry: HealthRegistryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthRegistryService,
        { provide: DiskHealthIndicator, useValue: { checkStorage: vi.fn<() => void>() } },
        { provide: HealthCheckService, useValue: { check: checkMock } },
        { provide: MemoryHealthIndicator, useValue: { checkHeap: vi.fn<() => void>() } },
      ],
    }).compile();

    controller = module.get(HealthController);
    registry = module.get(HealthRegistryService);
  });

  it('should run no liveness checks', async () => {
    // given / when
    await controller.live();

    // then
    expect(checkMock).toHaveBeenCalledWith([]);
  });

  it('should run disk, heap and registered readiness checks', async () => {
    // given
    registry.register('youtube', checkCustomMock);

    // when
    await controller.ready();

    // then
    expect(checkMock).toHaveBeenCalledWith([
      expect.any(Function),
      expect.any(Function),
      checkCustomMock,
    ]);
  });
});
