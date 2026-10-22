import { useTranslation } from '@ofo/i18n';
import { ScreenPlaceholder } from '../../components/screen-placeholder.tsx';

export default () => {
  const { t } = useTranslation();
  return <ScreenPlaceholder title={t('screens.search')} />;
};
