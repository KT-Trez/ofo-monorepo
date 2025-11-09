import { List, PageHeader } from '@components';
import { SongModel } from '@models';
import { useQuery } from '@realm/react';
import { useMemo, useState } from 'react';
import { useSongDownload, useSongFetch } from './hooks';
import { Song } from './Song';

export const SongsSearchPage = () => {
  const downloadSong = useSongDownload();
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading: areSongsLoading, songs } = useSongFetch(searchQuery);
  // const { isLoading: areSuggestionsLoading, suggestions } = useSuggestionFetch(searchQuery);

  const songsIds = useMemo<string[]>(() => songs.map(({ id }) => id), [songs]);
  const savedSongs = useQuery(SongModel, songs => songs.filtered('id IN $0', songsIds), [songsIds]);

  const savedSongsMap = useMemo<Record<string, boolean>>(
    () =>
      savedSongs.reduce<Record<string, boolean>>((acc, { id }) => {
        acc[id] = true;

        return acc;
      }, {}),
    [savedSongs],
  );

  return (
    <PageHeader subtitle="Powered by YouTube" title="Songs Downloader">
      <List.Content
        data={songs}
        emptyIcon="music-note"
        emptyText="Search online for music"
        Header={<List.SearchBar searchPhrase={searchQuery} setSearchPhrase={setSearchQuery} />}
        isLoading={areSongsLoading}
        renderItem={({ item }) => <Song download={downloadSong} isDownloaded={savedSongsMap[item.id]} item={item} />}
      />
    </PageHeader>
  );
};
