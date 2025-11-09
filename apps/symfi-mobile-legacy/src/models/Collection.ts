import { Realm } from '@realm/react';
import type { CollectionId, CollectionType } from '@types';
import { SongModel } from './Song';

export class CollectionModel extends Realm.Object<CollectionType> {
  static schema: Realm.ObjectSchema = {
    name: 'Collection',
    primaryKey: 'id',
    properties: {
      coverUri: 'string?',
      id: {
        default: () => new Realm.BSON.ObjectId(),
        type: 'objectId',
      },
      name: 'string',
      order: {
        default: 0,
        type: 'int',
      },
      // todo: reverse relationship
      songs: {
        objectType: SongModel.schema.name,
        property: 'collections',
        type: 'linkingObjects',
      },
    },
  };

  coverUri?: string;
  id!: CollectionId;
  name!: string;
  order!: number;
}
