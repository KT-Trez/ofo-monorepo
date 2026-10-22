import { useRouter } from 'expo-router';
import { useTranslation } from '@ofo/i18n';
import { Button } from '@ofo/ui/components/button';
import { ScreenPlaceholder } from '../../../components/screen-placeholder.tsx';

export default () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenPlaceholder title={t('screens.library')}>
      <Button onPress={() => router.push('/playlist/1')}>{t('actions.openPlaylist')}</Button>
    </ScreenPlaceholder>
  );
};
