import { Actions, List, PageHeader } from '@components';
import { useCollectionsManager, usePluralFormV3, useSelected } from '@hooks';
import { CollectionModel } from '@models';
import { useNavigation } from '@react-navigation/native';
import type { CollectionNavigatorProps } from '@types';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { Collection } from './Collection';
import { usePageHeaderActions } from './hooks';

export const CollectionList = () => {
  const { collections } = useCollectionsManager();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const s = usePluralFormV3(collections.length);
  const { isAnythingSelected, selected, toggleSelect, unselectAll } = useSelected<CollectionModel>();

  const actions = usePageHeaderActions({ selected, unselectAll });

  return (
    <PageHeader
      actions={<Actions actions={actions} />}
      showActions={isAnythingSelected}
      subtitle={`${collections.length} item${s}`}
      title="Collections"
    >
      <List.Content
        data={collections}
        renderItem={({ item }) => (
          <Collection
            isInSelectionMode={isAnythingSelected}
            isSelected={!!selected[item.id.toHexString()]}
            item={item}
            toggleSelect={toggleSelect}
          />
        )}
      />

      <FAB icon="plus" onPress={() => navigate('CollectionCreateForm')} style={styles.fab} variant="secondary" />
    </PageHeader>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
