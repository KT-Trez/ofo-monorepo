import type { ValidationError } from 'class-validator';
import { ApiException } from '../errors/api-exception.js';
import { ErrorCodes, type ErrorName } from '../errors/error-codes.js';
import { ERROR_HINT_CONTEXT_KEY } from './error-hint.ts';

const flatten = (errors: readonly ValidationError[]): ValidationError[] => {
  return errors.reduce<ValidationError[]>((acc, error) => {
    acc.push(error);

    if (error.children) {
      acc.push(...flatten(error.children));
    }

    return acc;
  }, []);
};

const isErrorName = (value: unknown): value is ErrorName => {
  return typeof value === 'string' && Object.hasOwn(ErrorCodes, value);
};

/**
 * `ValidationPipe` failures as `ApiException`: the first failed rule declared with `answers(...)`
 * decides the code, otherwise 1004 invalid_request; the detail lists every failure.
 */
export const validationExceptionFactory = (errors: ValidationError[]): ApiException => {
  const failures = flatten(errors);
  const hints = failures.flatMap(failure => {
    return Object.values(failure.contexts ?? {}).map(context => context?.[ERROR_HINT_CONTEXT_KEY]);
  });

  const messages = failures.flatMap(failure => Object.values(failure.constraints ?? {}));

  return new ApiException(
    hints.find(isErrorName) ?? 'invalid_request',
    messages.join('; ') || undefined,
  );
};
