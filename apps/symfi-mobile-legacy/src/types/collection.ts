import { Realm } from '@realm/react';

export type CollectionId = Realm.BSON.ObjectId;

export type CollectionType = {
  coverUri?: string;
  id: CollectionId;
  name: string;
  order: number;
};
