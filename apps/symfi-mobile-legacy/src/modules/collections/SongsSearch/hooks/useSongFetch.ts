import { DEFAULT_API_ORIGIN } from '@config';
import { useConstDebounce } from '@hooks';
import { ConfigItemModel } from '@models';
import { useObject } from '@realm/react';
import { useQuery } from '@tanstack/react-query';
import type { ApiError, CollectionFormat, SongTypeApi } from '@types';
import { ConfigItemsKeys, DATA_ARRAY_FALLBACK, QueryKeys } from '@utils';

export const useSongFetch = (query: string) => {
  const apiOrigin = useObject(ConfigItemModel, ConfigItemsKeys.API_ORIGIN);
  const origin = apiOrigin?.value || DEFAULT_API_ORIGIN;

  const debouncedQuery = useConstDebounce(query, 700);

  const { data, isLoading } = useQuery<CollectionFormat<SongTypeApi>, ApiError>({
    enabled: debouncedQuery.length >= 3,
    queryFn: () => fetch(new URL(`/v3/song/search?q=${debouncedQuery}`, origin)).then(res => res.json()),
    queryKey: [QueryKeys.SONGS, debouncedQuery],
  });

  return {
    isLoading,
    songs: data?.objects || DATA_ARRAY_FALLBACK,
  };
};
