import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Switch } from '@ofo/ui/components/switch';

type SwitchPlaygroundProps = {
  isDisabled: boolean;
  isChecked: boolean;
};

const SwitchPlayground = ({ isDisabled, isChecked: isCheckedInit }: SwitchPlaygroundProps) => {
  const [isChecked, setIsChecked] = useState(isCheckedInit);

  return (
    <Switch
      accessibilityLabel="Autoodtwarzanie"
      isChecked={isChecked}
      isDisabled={isDisabled}
      onChange={setIsChecked}
    />
  );
};

const meta = {
  args: { isChecked: false, isDisabled: false },
  component: SwitchPlayground,
  title: 'Components/Switch',
} satisfies Meta<typeof SwitchPlayground>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = {
  args: { isChecked: true },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};
