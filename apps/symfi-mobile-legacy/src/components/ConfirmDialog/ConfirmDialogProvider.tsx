import { usePluralFormV3 } from '@hooks';
import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { ConfirmDialogContext } from './context';
import type { DialogProps, UseConfirmDialogReturn } from './types';

type ConfirmDialogProviderProps = {
  children: ReactNode;
};

export const ConfirmDialogProvider = ({ children }: ConfirmDialogProviderProps) => {
  const [confirmDialog, setConfirmDialog] = useState<DialogProps | undefined>(undefined);
  const s = usePluralFormV3(confirmDialog?.items?.length || 0);

  const { colors } = useTheme();

  const close = useCallback(() => {
    setConfirmDialog(undefined);
  }, []);

  const open = useCallback((props: DialogProps) => {
    setConfirmDialog(props);
  }, []);

  const value = useMemo<UseConfirmDialogReturn>(() => ({ close, open }), [close, open]);

  return (
    <ConfirmDialogContext.Provider value={value}>
      <Portal>
        <Dialog dismissableBackButton onDismiss={close} visible={!!confirmDialog}>
          <Dialog.Title style={{ color: colors.onBackground }}>{confirmDialog?.title}</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: colors.onBackground }}>
              You are about to delete the following {(confirmDialog?.itemText || 'item') + s}:
            </Text>

            <FlatList
              data={confirmDialog?.items}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <Text numberOfLines={1} style={[{ color: colors.onBackground }, styles.itemText]}>
                  • {item}
                </Text>
              )}
              style={styles.flatList}
            />

            <Text style={{ color: colors.onBackground }}>Do you want to proceed?</Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button textColor={colors.error} onPress={confirmDialog?.onConfirm}>
              Delete
            </Button>
            <Button onPress={confirmDialog?.onCancel || close}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {children}
    </ConfirmDialogContext.Provider>
  );
};

const styles = StyleSheet.create({
  flatList: {
    marginLeft: 8,
    marginVertical: 8,
  },
  itemText: {
    fontWeight: 'bold',
  },
});
