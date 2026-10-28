import { type DependencyList, useEffect, useState } from 'react';
import { getQueryTables, type LiveSelect } from '../core/query-tables.ts';
import type { DatabaseClient } from '../types.ts';

type LiveQueryOptions<TResult> = {
  readonly deps?: DependencyList;
  readonly initialData?: TResult;
};

type LiveQueryReturnType<TData> = {
  readonly data: TData;
  readonly error: unknown;
  readonly isError: boolean;
};

export function useLiveQuery<TResult>(
  client: DatabaseClient,
  query: LiveSelect<TResult>,
  options: LiveQueryOptions<TResult> & { readonly initialData: TResult },
): LiveQueryReturnType<TResult>;
export function useLiveQuery<TResult>(
  client: DatabaseClient,
  query: LiveSelect<TResult>,
  options?: LiveQueryOptions<TResult>,
): LiveQueryReturnType<TResult | undefined>;
export function useLiveQuery<TResult>(
  client: DatabaseClient,
  query: LiveSelect<TResult>,
  { deps = [], initialData }: LiveQueryOptions<TResult> = {},
): LiveQueryReturnType<TResult | undefined> {
  const [data, setData] = useState<TResult | undefined>(initialData);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    let isActive = true;
    const tables = getQueryTables(query);

    const run = () => {
      query
        .then(result => isActive && setData(result))
        .catch(reason => isActive && setError(reason));
    };

    const unwatch = client.watchTables(tableName => {
      if (tables.has(tableName)) {
        run();
      }
    });

    run();

    return () => {
      isActive = false;
      unwatch();
    };
  }, deps);

  return {
    data,
    error,
    isError: error !== null,
  };
}
