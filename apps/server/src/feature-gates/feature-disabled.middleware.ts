import type { NextFunction, Request, Response } from 'express';
import { ApiException } from '../common/errors/api-exception.js';

export const featureDisabledMiddleware = (feature: string) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    const exception = new ApiException(
      'feature_disabled',
      `The "${feature}" feature is disabled on this server`,
    );

    next(exception);
  };
};
