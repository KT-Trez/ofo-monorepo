import { PageHeader } from '@components';
import { MusicSection, ServerSection } from './sections';

export const SettingsPage = () => {
  return (
    <PageHeader title="Settings">
      <MusicSection />
      <ServerSection />
    </PageHeader>
  );
};
