import { Icon, type IconName } from '@ofo/ui/components/icon';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type TabIconProps = {
  icon: IconName;
  isSelected: boolean;
};

export const TabIcon = ({ icon, isSelected }: TabIconProps) => {
  const { theme } = useUnistyles();
  const color = isSelected ? theme.colors.accentText : theme.colors.textTertiary;

  return (
    <View style={[styles.pill, isSelected && styles.pillSelected]}>
      <Icon color={color} isFilled={isSelected} name={icon} />
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  pill: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: theme.radius.default,
    flex: 1,
    justifyContent: 'center',
  },
  pillSelected: {
    backgroundColor: theme.colors.accentSubtle,
  },
}));
