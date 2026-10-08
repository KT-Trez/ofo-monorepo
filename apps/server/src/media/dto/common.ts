import { errorHint } from '../../common/validation/error-hint.ts';

export const SOURCE_VALIDATION_OPTIONS = {
  ...errorHint('unsupported_source'),
  message: 'The source "$value" is not supported',
};
