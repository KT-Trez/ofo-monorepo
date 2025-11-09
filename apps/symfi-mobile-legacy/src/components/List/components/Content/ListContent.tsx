// noinspection ES6PreferShortImport

import { Realm } from '@realm/react';
import { useCallback } from 'react';
import { FlatList, type FlatListProps, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { Loader } from '../../../Loader';

// const STICKY_HEADER_INDICES: number[] = [0];

type ListContentProps<T> = {
  data: T[] | Realm.OrderedCollection<T>;
  emptyIcon?: string;
  emptyText?: string;
  Header?: FlatListProps<T>['ListHeaderComponent'];
  isLoading?: boolean;
  onRefresh?: FlatListProps<T>['onRefresh'];
  renderItem: FlatListProps<T>['renderItem'];
};

export const ListContent = <T extends { id: string | Realm.BSON.ObjectId }>({
  data,
  emptyIcon,
  emptyText,
  Header,
  isLoading,
  onRefresh,
  renderItem,
}: ListContentProps<T>) => {
  const { colors } = useTheme();

  const keyExtractor = useCallback((item: T) => (typeof item.id === 'string' ? item.id : item.id.toHexString()), []);

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={data}
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        isLoading ? (
          <Loader />
        ) : (
          <View style={styles.emptyContent}>
            <Text style={{ color: colors.outline }} variant="bodyMedium">
              {emptyText || 'No items found'}
            </Text>
            <Icon color={colors.outline} source={emptyIcon || 'emoticon-sad-outline'} size={20} />
          </View>
        )
      }
      ListHeaderComponent={Header}
      onRefresh={onRefresh}
      renderItem={renderItem}
      // stickyHeaderIndices={STICKY_HEADER_INDICES}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 8,
    padding: 8,
  },
  emptyContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 24,
  },
});
