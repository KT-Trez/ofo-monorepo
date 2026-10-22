import type { IconName } from '@ofo/ui/components/icon';
import { IconButton } from '@ofo/ui/components/icon-button';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

type ScreenPlaceholderProps = {
  action?: { icon: IconName; label: string; onPress: () => void };
  children?: ReactNode;
  title: string;
};

/**
 * @deprecated - dev only
 */
export const ScreenPlaceholder = ({ action, children, title }: ScreenPlaceholderProps) => {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.topBar}>
        {action && (
          <IconButton
            accessibilityLabel={action.label}
            icon={action.icon}
            onPress={action.onPress}
          />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    gap: theme.space.lg,
    justifyContent: 'center',
    padding: theme.space.screenInset,
  },
  title: {
    ...theme.typography.variants.headingLg,
    color: theme.colors.textPrimary,
  },
  topBar: {
    flexDirection: 'row',
    height: theme.size.topBar,
    paddingHorizontal: theme.space.xs,
  },
}));
