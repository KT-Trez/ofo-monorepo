import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_PATH_FLAG } from './auth.constants.ts';

/** Exempts a controller or a handler from the global `AuthGuard`. */
export const AuthPublic = () => SetMetadata(IS_PUBLIC_PATH_FLAG, true);
