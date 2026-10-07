import type { ValidationOptions } from 'class-validator';
import type { ErrorName } from '../errors/error-codes.js';

export const ERROR_HINT_CONTEXT_KEY = 'hint';

export const errorHint = (error: ErrorName): ValidationOptions => ({
  context: { [ERROR_HINT_CONTEXT_KEY]: error },
});
