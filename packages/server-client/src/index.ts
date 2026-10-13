import type { Client } from 'openapi-fetch';
import createClient from 'openapi-fetch';
import type { paths } from './schema.ts';

export type { components, operations, paths } from './schema.ts';

export type ApiClient = Client<paths>;

export type ApiClientOptions = {
  /** Static token (`auth.mode = token`) or OIDC access token (`auth.mode = oidc`). */
  token?: string;
};

export const createApiClient = (baseUrl: string, options: ApiClientOptions = {}): ApiClient => {
  return createClient<paths>({
    baseUrl,
    headers: options.token ? { Authorization: `Bearer ${options.token}` } : undefined,
  });
};
