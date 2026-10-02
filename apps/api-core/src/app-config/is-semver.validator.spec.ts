import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { IsSemver } from './is-semver.validator.js';

class SemverDtoMock {
  @IsSemver()
  version!: string;
}

class CustomMessageSemverDtoMock {
  @IsSemver({ message: 'custom message' })
  version!: string;
}

describe('IsSemver', () => {
  it.for<[message: string, version: string]>([
    ['version', '1.0.0'],
    ['with prerelease', '1.0.0-alpha'],
    ['with build metadata', '1.0.0+20130313144700'],
  ])('should accept valid semver %s', ([_, version]) => {
    // given
    const dto = plainToInstance(SemverDtoMock, { version });

    // when
    const errors = validateSync(dto);

    // then
    expect(errors).toEqual([]);
  });

  it.for<[message: string, version: null | number | string | undefined]>([
    ['format', 'abc'],
    ['with non-string values', 123],
    ['with null values', null],
    ['with undefined values', undefined],
    ['with empty strings', ''],
    ['with incomplete version strings', '1.0'],
    ['with leading zeros', '01.0.0'],
  ])('should reject invalid semver %s', ([_, version]) => {
    // given
    const dto = plainToInstance(SemverDtoMock, { version });

    // when
    const errors = validateSync(dto);

    // then
    expect(errors).toHaveLength(1);
    expect(errors.at(0)?.property).toBe('version');
  });

  it('should use custom error message when there is no custom message provided', () => {
    // given
    const dto = plainToInstance(SemverDtoMock, { version: 'invalid' });

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.at(0)?.constraints).toBeDefined();
    expect(errors.at(0)?.constraints?.isSemver).toBe('version must be a valid semver version');
  });

  it('should use custom error message when provided', () => {
    // given
    const dto = plainToInstance(CustomMessageSemverDtoMock, { version: 'invalid' });

    // when
    const errors = validateSync(dto);

    // then
    expect(errors.at(0)?.constraints).toBeDefined();
    expect(errors.at(0)?.constraints?.isSemver).toBe('custom message');
  });
});
