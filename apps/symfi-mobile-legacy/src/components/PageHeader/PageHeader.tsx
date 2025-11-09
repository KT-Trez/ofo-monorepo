import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { PageHeaderContent } from './PageHeaderContent';

const APPBAR_HEIGHT = 70;

type PageHeaderProps = {
  actions?: ReactNode;
  children?: ReactNode;
  showActions?: boolean;
  subtitle?: string;
  title: string;
};

export const PageHeader = ({ actions, children, showActions, subtitle, title }: PageHeaderProps) => {
  const { colors } = useTheme();

  return (
    <>
      <Appbar style={[{ backgroundColor: colors.primary }, styles.appbar]}>
        {showActions ? actions : <PageHeaderContent subtitle={subtitle} title={title} />}
      </Appbar>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  appbar: {
    height: APPBAR_HEIGHT,
    paddingHorizontal: 16,
  },
});
