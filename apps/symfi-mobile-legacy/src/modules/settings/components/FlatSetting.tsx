import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, ButtonProps, Icon, Text, useTheme } from 'react-native-paper';

type FlatSettingProps = {
  description: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress?: ButtonProps['onPress'];
  title: string;
};

export const FlatSetting = ({ description, isDisabled, isLoading, onPress, title }: FlatSettingProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity disabled={isDisabled || isLoading} onPress={onPress}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title} variant="bodyMedium">
            {title}
          </Text>
          <Text style={[styles.description, { color: colors.outline }]} variant="bodySmall">
            {description}
          </Text>
        </View>

        {isLoading ? <ActivityIndicator /> : <Icon color={colors.primary} source="arrow-right-drop-circle" size={30} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    width: '100%',
  },
  description: {
    marginTop: 4,
    maxWidth: '90%',
  },
  title: {
    maxWidth: '90%',
  },
});
