import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Action } from './Action';
import type { ActionsList } from './types';

type ActionsProps = {
  actions: ActionsList;
};

export const Actions = memo(({ actions: [left, right] }: ActionsProps) => (
  <View style={styles.container}>
    <View style={styles.side}>
      {left.map((action, index) => (
        <Action item={action} key={index} />
      ))}
    </View>

    <View style={styles.side}>
      {right.map((action, index) => (
        <Action item={action} key={index} />
      ))}
    </View>
  </View>
));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  side: {
    flexDirection: 'row',
  },
});
