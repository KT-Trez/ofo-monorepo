import { DEFAULT_API_ORIGIN } from '@config';
import { useConstDebounce } from '@hooks';
import { ConfigItemModel } from '@models';
import { useObject } from '@realm/react';
import { useQuery } from '@tanstack/react-query';
import type { ApiError, CollectionFormat } from '@types';
import { ConfigItemsKeys, QueryKeys } from '@utils';

export const useSuggestionFetch = (query: string) => {
  const apiOrigin = useObject(ConfigItemModel, ConfigItemsKeys.API_ORIGIN);
  const origin = apiOrigin?.value || DEFAULT_API_ORIGIN;

  const debouncedQuery = useConstDebounce(query, 700);

  const { data, isLoading } = useQuery<CollectionFormat<string>, ApiError>({
    enabled: debouncedQuery.length >= 3,
    queryFn: () => fetch(`${origin}/v3/song/suggestion?q=${debouncedQuery}`).then(res => res.json()),
    queryKey: [QueryKeys.SUGGESTIONS, debouncedQuery],
  });

  return {
    isLoading,
    suggestions: data?.objects || [],
  };
};
