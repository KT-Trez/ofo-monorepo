import { plainToInstance, Type } from 'class-transformer';
import { IsIn, IsString, Matches, ValidateNested, validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { errorHint } from './error-hint.ts';
import { validationExceptionFactory } from './validation-exception.factory.js';

class MockDto {
  @Matches(/^\w{3}$/)
  id!: string;

  @IsString()
  name!: string;

  @ValidateNested()
  @Type(() => MockNestedDto)
  nested!: MockNestedDto;

  @IsIn(['youtube'], errorHint('unsupported_source'))
  source!: string;
}

class MockNestedDto {
  @IsIn(['m4a'], errorHint('unsupported_format'))
  format!: string;
}

describe('validationExceptionFactory', () => {
  const createException = (plain: object) => {
    return validationExceptionFactory(validateSync(plainToInstance(MockDto, plain)));
  };

  const validDto: MockDto = {
    id: 'abc',
    name: 'n',
    nested: { format: 'm4a' },
    source: 'youtube',
  };

  it('should answer 1004 for rules without a declared error and list every failure', () => {
    // given / when
    const exception = createException({ ...validDto, id: 'toolong', name: 1 });

    // then
    expect(exception.code).toBe(1004);
    expect(exception.detail).toContain('id must match');
    expect(exception.detail).toContain('name must be a string');
  });

  it('should answer with the error declared by a failed rule over the plain ones', () => {
    // given / when / then
    expect(createException({ ...validDto, id: 'toolong', source: 'vimeo' }).code).toBe(2001);
  });

  it('should read the declared errors of nested objects', () => {
    // given / when / then
    expect(createException({ ...validDto, nested: { format: 'mp3' } }).code).toBe(2002);
  });

  it('should ignore the declared error of a rule that passed', () => {
    // given / when / then
    expect(createException({ ...validDto, name: 1 }).code).toBe(1004);
  });
});
