import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { ToggleButton, type ToggleButtonOption } from '@ofo/ui/components/toggle-button';

type Filter = 'all' | 'downloaded' | 'failed';

type SortOrder = 'az' | 'custom';

const FILTER_OPTIONS: ToggleButtonOption<Filter>[] = [
  { label: 'Wszystkie', value: 'all' },
  { icon: 'download_done', label: 'Pobrane', value: 'downloaded' },
  { icon: 'error', label: 'Błędy', value: 'failed' },
];

const SORT_OPTIONS: ToggleButtonOption<SortOrder>[] = [
  { icon: 'drag_indicator', label: 'Moja kolejność', value: 'custom' },
  { icon: 'sort_by_alpha', label: 'Sortuj po nazwie', value: 'az' },
];

const FilterExample = () => {
  const [filter, setFilter] = useState<Filter>('all');

  return (
    <ToggleButton
      accessibilityLabel="Filtr"
      onChange={setFilter}
      options={FILTER_OPTIONS}
      value={filter}
    />
  );
};

const SortExample = ({ isIconOnly }: { isIconOnly: boolean }) => {
  const [sort, setSort] = useState<SortOrder>('custom');

  return (
    <ToggleButton
      accessibilityLabel="Sortowanie"
      isIconOnly={isIconOnly}
      onChange={setSort}
      options={SORT_OPTIONS}
      value={sort}
    />
  );
};

const meta = {
  args: { isIconOnly: false },
  component: SortExample,
  title: 'Components/ToggleButton',
} satisfies Meta<typeof SortExample>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const IconsOnly: Story = {
  args: { isIconOnly: true },
};

export const MixedOptions: Story = {
  render: () => <FilterExample />,
};
