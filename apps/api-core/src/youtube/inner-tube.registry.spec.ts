import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import type { UnknownRecord } from 'es-toolkit/types';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import Innertube, { UniversalCache } from 'youtubei.js';
import type { ApiCoreConfig } from '../../config/configuration.js';
import { createInnerTubeFactory } from '../../test/utils/innerTube.js';
import { type InnerTubeCreator, InnerTubeFactory } from './inner-tube.factory.js';
import { InnerTubeRegistry } from './inner-tube.registry.js';

vi.mock('node:fs', async importOriginal => ({
  ...(await importOriginal<typeof import('node:fs')>()),
  mkdirSync: vi.fn<() => string | undefined>(() => undefined),
}));

describe('InnerTubeRegistry', () => {
  const defaultAppConfig = {
    languages: ['en', 'pl'],
  } satisfies Partial<ApiCoreConfig['app']>;
  const defaultYouTubeConfig = {
    cacheDir: '/tmp',
    playerId: undefined,
    poToken: undefined,
    sessionTtlMin: 10,
  } satisfies Partial<ApiCoreConfig['youtube']>;

  const getOrThrowMock = vi.fn<() => UnknownRecord>();

  let factoryMock: Mock<InnerTubeCreator>;
  let registry: InnerTubeRegistry;
  let instancesMock: Innertube[];

  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  beforeEach(async () => {
    const { factory, instances } = createInnerTubeFactory();
    const module = await Test.createTestingModule({
      providers: [
        InnerTubeRegistry,
        {
          provide: ConfigService,
          useValue: { getOrThrow: getOrThrowMock },
        },
        {
          provide: InnerTubeFactory.INNER_TUBE_SYMBOL,
          useValue: factory,
        },
      ],
    }).compile();

    factoryMock = factory;
    registry = module.get(InnerTubeRegistry);
    instancesMock = instances;
  });

  describe('getInstanceForLocale', () => {
    it('should create one instance per locale without the player and reuse it', async () => {
      // given
      getOrThrowMock.mockReturnValue(defaultAppConfig);

      // when
      const firstInstancePL = await registry.getInstanceForLocale('pl');
      const secondInstancePL = await registry.getInstanceForLocale('pl');

      const instanceEN = await registry.getInstanceForLocale('en');

      // then
      expect(factoryMock).toHaveBeenCalledTimes(2);
      expect(factoryMock).toHaveBeenNthCalledWith(1, {
        cache: expect.any(UniversalCache),
        generate_session_locally: true,
        lang: 'pl',
        location: 'US', // todo: fix locale-lang-location mapping
        retrieve_player: false,
      });
      expect(factoryMock).toHaveBeenNthCalledWith(2, {
        cache: expect.any(UniversalCache),
        generate_session_locally: true,
        lang: 'en',
        location: 'US', // todo: fix locale-lang-location mapping
        retrieve_player: false,
      });

      expect(firstInstancePL).toBe(secondInstancePL);
      expect(firstInstancePL).not.toBe(instanceEN);
    });

    it('should fall back to the first supported locale for unknown ones', async () => {
      // given
      getOrThrowMock.mockReturnValue(defaultAppConfig);

      // when
      const instanceDE = await registry.getInstanceForLocale('de');
      const instanceEN = await registry.getInstanceForLocale('en');

      // then
      expect(factoryMock).toHaveBeenCalledTimes(1);
      expect(instanceDE).toBe(instanceEN);
    });

    it('should not cache a failed locale creation', async () => {
      // given
      factoryMock.mockRejectedValueOnce(new Error('Something went wrong'));
      getOrThrowMock.mockReturnValue(defaultAppConfig);

      // when
      const cb = () => registry.getInstanceForLocale('de');

      // then
      await expect(cb).rejects.toThrow('Something went wrong');

      // when
      const result = await registry.getInstanceForLocale('de');

      // then
      expect(result).toBe(instancesMock.at(0));
      expect(factoryMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('createMainInstance', () => {
    it('should create the main instance lazily', async () => {
      // given
      getOrThrowMock.mockReturnValue(defaultYouTubeConfig);

      // when
      const result = await registry.getMainInstance();

      // then
      expect(result).toBe(instancesMock.at(0));
      expect(factoryMock).toHaveBeenCalledTimes(1);
      expect(factoryMock).toHaveBeenCalledWith({
        cache: expect.any(UniversalCache),
        generate_session_locally: true,
        lang: 'en',
        location: 'US',
        retrieve_player: true,
      });
    });

    it('should create the main instance lazily with the "player_id" and "poToken"', async () => {
      // given
      getOrThrowMock.mockReturnValue({
        ...defaultYouTubeConfig,
        playerId: 'player-id-mock',
        poToken: 'po-token-mock',
      } satisfies Partial<ApiCoreConfig['youtube']>);

      // when
      const result = await registry.getMainInstance();

      // then
      expect(result).toBe(instancesMock.at(0));
      expect(factoryMock).toHaveBeenCalledTimes(1);
      expect(factoryMock).toHaveBeenCalledWith({
        cache: expect.any(UniversalCache),
        generate_session_locally: true,
        lang: 'en',
        location: 'US',
        player_id: 'player-id-mock',
        po_token: 'po-token-mock',
        retrieve_player: true,
      });
    });

    it('should rotate after the session TTL while the old instance keeps serving', async () => {
      // given
      getOrThrowMock.mockReturnValue(defaultYouTubeConfig);

      // when - create first instance and capture the next one in a pending promise
      const firstInstance = await registry.getMainInstance();
      const factoryMockOriginalImplementation = factoryMock.getMockImplementation();
      const { promise, resolve } = Promise.withResolvers();

      factoryMock.mockImplementationOnce(async options => {
        await promise;

        return factoryMockOriginalImplementation!(options);
      });

      // when - advance time past TTL to mark instance as stale
      vi.advanceTimersByTime(defaultYouTubeConfig.sessionTtlMin * 60_000 + 1);

      const firstInstanceDuringRotation = await registry.getMainInstance();

      // then - first instance is still being used during rotation
      expect(firstInstanceDuringRotation).toBe(firstInstance);

      // when - finish rotation
      resolve(true);
      await vi.runAllTimersAsync();

      const secondInstance = await registry.getMainInstance();

      // then
      expect(factoryMock).toHaveBeenCalledTimes(2);
      expect(firstInstanceDuringRotation).toBe(firstInstance);
      expect(secondInstance).not.toBe(firstInstance);
    });

    it('should recreate the main instance after invalidation', async () => {
      // given
      getOrThrowMock.mockReturnValue(defaultYouTubeConfig);

      // when
      const firstInstance = await registry.getMainInstance();

      registry.invalidateMainInstance();
      await registry.getMainInstance(); // trigger recreation
      await vi.runAllTimersAsync();

      const secondInstance = await registry.getMainInstance();

      // then
      expect(factoryMock).toHaveBeenCalledTimes(2);
      expect(secondInstance).not.toBe(firstInstance);
    });

    it('should keep the old instance when rotation fails and retry later', async () => {
      // given
      getOrThrowMock.mockReturnValue(defaultYouTubeConfig);

      // when
      const firstInstance = await registry.getMainInstance();

      factoryMock.mockRejectedValueOnce(new Error('Something went wrong'));
      registry.invalidateMainInstance();

      const firstInstanceDuringRotation = await registry.getMainInstance();
      await vi.runAllTimersAsync();
      const firstInstanceDuringRetry = await registry.getMainInstance();
      await vi.runAllTimersAsync();
      const secondInstance = await registry.getMainInstance();

      // then
      expect(factoryMock).toHaveBeenCalledTimes(3);
      expect(firstInstanceDuringRotation).toBe(firstInstance);
      expect(firstInstanceDuringRetry).toBe(firstInstance);
      expect(secondInstance).not.toBe(firstInstance);
    });
  });

  describe('createMainInstanceOnce', () => {
    it('should share one creation between concurrent calls', async () => {
      // given
      getOrThrowMock.mockReturnValue(defaultYouTubeConfig);

      // when
      const [instanceA, instanceB, instanceC] = await Promise.all([
        registry.getMainInstance(),
        registry.getMainInstance(),
        registry.getMainInstance(),
      ]);

      // then
      expect(instanceA).toBe(instanceB);
      expect(instanceA).toBe(instanceC);
      expect(factoryMock).toHaveBeenCalledTimes(1);
    });

    it('should not cache a failed creation', async () => {
      // given
      factoryMock.mockRejectedValueOnce(new Error('Something went wrong'));
      getOrThrowMock.mockReturnValue(defaultYouTubeConfig);

      // when
      const cb = () => registry.getMainInstance();

      // then
      await expect(cb).rejects.toThrow('Something went wrong');

      // when
      const result = await registry.getMainInstance();

      // then
      expect(result).toBe(instancesMock.at(0));
      expect(factoryMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('parseLangFromString', () => {
    beforeEach(() => {
      getOrThrowMock.mockReturnValue(defaultAppConfig);
    });

    it.for<[text: string, lang: string]>([
      ['en', 'en'],
      ['pl', 'pl'],
      ['de', 'en'],
    ])('should map "%s" to "%s"', ([text, lang]) => {
      // when
      expect(registry.parseLangFromString(text)).toBe(lang);
    });
  });

  describe('parseLocationFromLocale', () => {
    it.for<[locale: string, location: string]>([
      ['en', 'US'],
      ['en-GB', 'GB'],
      ['pl-PL', 'PL'],
      ['de', 'US'],
    ])('should map "%s" to "%s"', ([locale, location]) => {
      // when
      expect(registry).toHaveProperty('parseLocationFromLocale');
      expect(registry['parseLocationFromLocale'](locale)).toBe(location);
    });
  });
});
