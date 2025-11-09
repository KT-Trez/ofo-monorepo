import { Appbar, useTheme } from 'react-native-paper';
import type { ActionType } from './types';

type ActionProps = {
  item: ActionType;
};

export const Action = ({ item }: ActionProps) => {
  const { colors } = useTheme();
  const { color, icon, isHidden, onPress } = item;

  if (isHidden) {
    return null;
  }

  return <Appbar.Action color={color || colors.onPrimary} icon={icon} onPress={onPress} />;
};
