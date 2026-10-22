import { useRouter } from 'expo-router';
import { useTranslation } from '@ofo/i18n';
import { IconGlyph } from '@ofo/ui/components/icon';
import { ScreenPlaceholder } from '../../../components/screen-placeholder.tsx';

export default () => {
  const { t } = useTranslation();
  const router = useRouter();

  // todo: confirm leaving with unsaved changes ("Odrzucić zmiany?") via `usePreventRemove`
  return (
    <ScreenPlaceholder
      action={{ icon: IconGlyph.Close, label: t('actions.close'), onPress: router.back }}
      title={t('screens.addTracks')}
    />
  );
};
