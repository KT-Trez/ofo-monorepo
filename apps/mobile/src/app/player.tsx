import { useRouter } from 'expo-router';
import { useTranslation } from '@ofo/i18n';
import { IconGlyph } from '@ofo/ui/components/icon';
import { ScreenPlaceholder } from '../components/screen-placeholder.tsx';

export default () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenPlaceholder
      action={{ icon: IconGlyph.ExpandMore, label: t('actions.close'), onPress: router.back }}
      title={t('screens.player')}
    />
  );
};
