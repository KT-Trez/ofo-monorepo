import { HealthIndicatorService } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import postgres from 'postgres';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HealthRegistryService } from '../../health/health-registry.service.js';
import { DatabaseModule } from './database.module.js';

describe('DatabaseModule', () => {
  const endMock = vi.fn();
  const clientMock = vi.fn<postgres.Sql>();
  clientMock.end = endMock;

  let databaseModule: DatabaseModule;
  let registry: HealthRegistryService;

  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DatabaseModule,
        {
          provide: DatabaseModule.POSTGRES_CLIENT,
          useValue: clientMock,
        },
        {
          provide: HealthIndicatorService,
          useValue: new HealthIndicatorService(),
        },
        {
          provide: HealthRegistryService,
          useValue: new HealthRegistryService(),
        },
      ],
    }).compile();

    await module.init();
    databaseModule = module.get(DatabaseModule);
    registry = module.get(HealthRegistryService);
  });

  it('should register a database readiness check that reports up', async () => {
    // given
    // @ts-expect-error: we don't need the actual value, just a resolved promise
    clientMock.mockResolvedValue({});

    // when
    databaseModule.onModuleInit();

    const [check] = registry.list();
    const result = await check!();

    // then
    expect(result).toEqual({ database: { status: 'up' } });
  });

  it('should report down when the ping fails', async () => {
    // given
    clientMock.mockRejectedValue(new Error('Something went wrong'));

    // when
    const [check] = registry.list();
    const result = await check!();

    // then
    expect(result).toEqual({ database: { message: 'Something went wrong', status: 'down' } });
  });

  it('should report down when the timeout ends', async () => {
    // given
    const { promise } = Promise.withResolvers<void>();
    // @ts-expect-error: we don't need the actual value, just a pending promise
    clientMock.mockReturnValue(promise);

    // when
    const [check] = registry.list();
    const resultPromise = check!();

    vi.advanceTimersByTime(3000);

    const result = await resultPromise;

    // then
    expect(result).toEqual({
      database: { message: 'The operation was timed out', status: 'down' },
    });
  });

  it('should close the client on shutdown', async () => {
    // given

    // when
    await databaseModule.onApplicationShutdown();

    // then
    expect(endMock).toHaveBeenCalledWith({ timeout: 5 });
  });
});
