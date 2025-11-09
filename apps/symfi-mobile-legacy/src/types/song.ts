export type SongId = string;

export type SongType = SongTypeApi & {
  cover?: string;
  file?: File;
};

export type SongTypeApi = {
  channel: Channel;
  duration: Duration;
  id: SongId;
  name: string;
  published: string;
  thumbnail: string;
  views: Views;
};

// helper types
export type Channel = {
  name: string;
  url: string;
};

export type Duration = {
  label: string;
  seconds: number;
};

export type File = {
  modifiedDate: Date;
  uri: string;
  size: number;
};

export type Views = {
  count: number;
  label: string;
};
