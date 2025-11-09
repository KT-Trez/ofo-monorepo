import { Realm } from '@realm/react';
import type { ConfigItem } from '@types';

export class ConfigItemModel extends Realm.Object<ConfigItem> {
  static schema: Realm.ObjectSchema = {
    name: 'ConfigItem',
    primaryKey: 'key',
    properties: {
      key: 'string',
      value: 'string',
    },
  };

  key!: string;
  value!: string;

  static generate({ key, value }: ConfigItem): ConfigItem {
    return {
      key,
      value,
    };
  }
}
