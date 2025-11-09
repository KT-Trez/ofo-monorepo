import { Realm } from '@realm/react';
import type { Channel, Duration, File, PartialBy, SongId, SongType, Views } from '@types';
import type { CollectionModel } from './Collection';

export class ChannelModel extends Realm.Object<Channel, keyof Channel> {
  static schema: Realm.ObjectSchema = {
    name: 'Channel',
    properties: {
      name: 'string',
      url: 'string',
    },
  };

  name!: string;
  url!: string;
}

export class DurationModel extends Realm.Object<Duration, keyof Duration> {
  static schema: Realm.ObjectSchema = {
    name: 'Duration',
    properties: {
      label: 'string',
      seconds: 'int',
    },
  };

  label!: string;
  seconds!: number;
}

export class FileModel extends Realm.Object<File, keyof File> {
  static schema: Realm.ObjectSchema = {
    name: 'File',
    properties: {
      modifiedDate: 'date',
      uri: 'string',
      size: 'int',
    },
  };

  modifiedDate!: Date;
  uri!: string;
  size!: number;

  static generate({ modifiedDate, uri, size }: File): File {
    return {
      modifiedDate,
      uri,
      size,
    };
  }
}

export class ViewsModel extends Realm.Object<Views, keyof Views> {
  static schema: Realm.ObjectSchema = {
    name: 'Views',
    properties: {
      count: 'int',
      label: 'string',
    },
  };

  count!: number;
  label!: string;
}

export class SongModel extends Realm.Object<SongType, Exclude<keyof SongType, 'cover' | 'file'>> {
  static schema: Realm.ObjectSchema = {
    name: 'Song',
    primaryKey: 'id',
    properties: {
      channel: {
        objectType: ChannelModel.schema.name,
        type: 'object',
      },
      collections: 'Collection[]',
      cover: 'string?',
      duration: {
        objectType: DurationModel.schema.name,
        type: 'object',
      },
      file: {
        objectType: FileModel.schema.name,
        optional: true,
        type: 'object',
      },
      id: 'string',
      name: 'string',
      published: 'string',
      thumbnail: 'string',
      views: {
        objectType: ViewsModel.schema.name,
        type: 'object',
      },
    },
  };

  channel!: Channel;
  collections!: CollectionModel[];
  cover?: string;
  duration!: Duration;
  file?: File;
  id!: SongId;
  name!: string;
  published!: string;
  thumbnail!: string;
  views!: Views;

  static generate({
    channel,
    cover,
    duration,
    file,
    id,
    name,
    published,
    thumbnail,
    views,
  }: PartialBy<SongType, 'cover' | 'file'>): SongType {
    return {
      channel,
      cover,
      duration,
      file,
      id,
      name,
      published,
      thumbnail,
      views,
    };
  }
}
