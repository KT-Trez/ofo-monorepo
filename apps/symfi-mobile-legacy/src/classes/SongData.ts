import { SCHEMA_VERSION } from '@config';
import { Musicly } from '../../types';

interface Channel {
  id: string;
  name: string;
  url: string;
}

interface Cover {
  color: string;
  name: string;
  uri?: string;
}

interface File {
  downloadDate?: Date;
  id?: string;
  path?: string;
  size?: number;
}

interface SongFlags {
  hasCover: boolean;
  isDownloaded: boolean;
  isFavourite: boolean;
}

interface SongMetadata {
  badges: string[];
  duration: {
    accessibility_label: string;
    seconds: number;
    simple_text: string;
  };
  owner_badges: string[];
  published: string;
  short_view_count_text: {
    accessibility_label: string;
    simple_text: string;
  };
  thumbnails: Thumbnail[];
  view_count: string;
}

interface Thumbnail {
  height: number;
  url: string;
  width: number;
}

export interface SongDataConstructor {
  channel: Channel;
  description: string;
  id: string;
  metadata: SongMetadata;
  musicly: {
    cover?: Cover;
    file?: File;
    flags?: SongFlags;
    playListsIDs?: string[];
    version?: number;
    wasPlayed?: number;
  };
  title: string;
  url: string;
}

export default class SongData implements Musicly.Data.Song {
  channel: { id: string; name: string; url: string };
  description: string;
  id: string;
  metadata: SongMetadata;
  musicly: Musicly.Data.SongMusicly;
  title: string;
  url: string;

  constructor(options: SongDataConstructor) {
    this.channel = options.channel;
    this.description = options.description;
    this.id = options.id;
    this.metadata = options.metadata;

    this.musicly = {
      cover: {
        color: options.musicly.cover?.color ?? Math.floor(Math.random() * 16777215).toString(16),
        name:
          options.musicly.cover?.name ??
          [options.id, parseInt(Math.round(Math.random() * 100).toString() + new Date().getTime()).toString(16)]
            .join('-')
            .replace(/\s*/, ''),
        uri: options.musicly.cover?.uri,
      },
      file: {
        downloadDate: options.musicly.file?.downloadDate ?? new Date(),
        id: options.musicly.file?.id,
        path: options.musicly.file?.path,
        size: options.musicly.file?.size,
      },
      flags: {
        hasCover: options.musicly.flags?.hasCover ?? !!options.musicly.cover?.uri,
        isDownloaded: options.musicly.flags?.isDownloaded ?? !!options.musicly.file?.path,
        isFavourite: !!options.musicly.flags?.isFavourite,
      },
      playListsIDs: options.musicly.playListsIDs ?? [],
      version: options.musicly.version ?? SCHEMA_VERSION,
      wasPlayed: options.musicly.wasPlayed ?? 0,
    };

    this.title = options.title;
    this.url = options.url;
  }
}
