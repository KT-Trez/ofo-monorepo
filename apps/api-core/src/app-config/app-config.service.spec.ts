import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ClientPlatform } from '@ofo/types/app-config';
import type { UnknownRecord } from 'es-toolkit/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApiCoreConfig } from '../../config/configuration.js';
import { AppConfigController } from './app-config.controller.js';
import { AppConfigService } from './app-config.service.js';

describe('AppConfigController', () => {
  const defaultAppConfig = {
    minSupportedDesktopVersion: '1.4.0',
    minSupportedMobileVersion: '1.6.0',
    profile: 'standalone',
  } satisfies Partial<ApiCoreConfig['app']>;
  const getOrThrowMock = vi.fn<() => UnknownRecord>();

  let controller: AppConfigController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AppConfigController],
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: { getOrThrow: getOrThrowMock },
        },
      ],
    }).compile();

    controller = module.get(AppConfigController);
  });

  it('should return app config', async () => {
    // given
    getOrThrowMock.mockReturnValue(defaultAppConfig);

    const appVersion = defaultAppConfig.minSupportedDesktopVersion;
    const platform = ClientPlatform.Desktop;

    // when
    const result = controller.getConfig({ appVersion, platform });

    // then
    expect(result).toEqual({
      formats: ['m4a', 'opus'],
      minSupportedVersion: defaultAppConfig.minSupportedDesktopVersion,
      profile: defaultAppConfig.profile,
      updateRequired: false,
    });
  });

  it('should flag "updateRequired" for desktop version below the minimum', async () => {
    // given
    getOrThrowMock.mockReturnValue(defaultAppConfig);

    const appVersion = '1.0.0';
    const platform = ClientPlatform.Desktop;

    // when
    const result = controller.getConfig({ appVersion, platform });

    // then
    expect(result.minSupportedVersion).toBe(defaultAppConfig.minSupportedDesktopVersion);
    expect(result.updateRequired).toBe(true);
  });

  it('should flag "updateRequired" for mobile version below the minimum', async () => {
    // given
    getOrThrowMock.mockReturnValue(defaultAppConfig);

    const appVersion = '1.0.0';
    const platform = ClientPlatform.Mobile;

    // when
    const result = controller.getConfig({ appVersion, platform });

    // then
    expect(result.minSupportedVersion).toBe(defaultAppConfig.minSupportedMobileVersion);
    expect(result.updateRequired).toBe(true);
  });
});
