import { ClientPlatform } from '@ofo/types/app-config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { AppConfigQueryDto } from './app-config.dto.js';

describe('AppConfigQueryDto', () => {
  describe('appVersion', () => {
    it.for(['1.0.0', '1.0.0-alpha', '1.0.0+build'])(
      'should accept valid query with "%s"',
      version => {
        // given
        const dto = plainToInstance(AppConfigQueryDto, {
          appVersion: version,
          platform: ClientPlatform.Desktop,
        });

        // when
        const errors = validateSync(dto);

        // then
        expect(errors).toEqual([]);
      },
    );

    it('should reject invalid query', () => {
      // given
      const dto = plainToInstance(AppConfigQueryDto, {
        appVersion: 'invalid',
        platform: ClientPlatform.Desktop,
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.at(0)?.property).toBe('appVersion');
    });

    it('rejects missing query', () => {
      // given
      const dto = plainToInstance(AppConfigQueryDto, {
        platform: ClientPlatform.Desktop,
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.at(0)?.property).toBe('appVersion');
    });
  });

  describe('platform', () => {
    it.for(AppConfigQueryDto.CLIENT_PLATFORMS)('should accept valid query with "%s"', platform => {
      // given
      const dto = plainToInstance(AppConfigQueryDto, {
        appVersion: '1.0.0',
        platform,
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors).toEqual([]);
    });

    it('should reject invalid query', () => {
      // given
      const dto = plainToInstance(AppConfigQueryDto, {
        appVersion: '1.0.0',
        platform: 'invalid',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.at(0)?.property).toBe('platform');
    });

    it('should reject missing query', () => {
      // given
      const dto = plainToInstance(AppConfigQueryDto, {
        appVersion: '1.0.0',
      });

      // when
      const errors = validateSync(dto);

      // then
      expect(errors.at(0)?.property).toBe('platform');
    });
  });

  it('should reject missing queries', () => {
    // given
    const dto = plainToInstance(AppConfigQueryDto, {});

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.map(error => error.property).toSorted()).toEqual(['appVersion', 'platform']);
  });
});
