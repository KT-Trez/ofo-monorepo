import { useTranslation } from '@ofo/i18n';
import { Button } from '@ofo/ui/components/button';
import { IconGlyph } from '@ofo/ui/components/icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenPlaceholder } from '../../../../components/screen-placeholder.tsx';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenPlaceholder
      action={{ icon: IconGlyph.ArrowBack, label: t('actions.back'), onPress: router.back }}
      title={t('screens.playlist')}
    >
      <Button
        onPress={() => router.push({ params: { id }, pathname: '/playlist/[id]/add-tracks' })}
      >
        {t('actions.addTracks')}
      </Button>
    </ScreenPlaceholder>
  );
};
