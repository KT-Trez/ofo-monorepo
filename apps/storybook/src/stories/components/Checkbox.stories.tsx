import { Checkbox, type CheckboxProps } from '@ofo/ui/components/checkbox';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';

const CheckboxPlayground = ({
  isDisabled,
  isChecked: isCheckedInit,
  isIndeterminate: isIndeterminateInit,
}: Omit<CheckboxProps, 'accessibilityLabel' | 'onChange'>) => {
  const [isChecked, setIsChecked] = useState(isCheckedInit);
  const [isIndeterminate, setIsIndeterminate] = useState(isIndeterminateInit);

  return (
    <Checkbox
      accessibilityLabel="Zaznacz utwór"
      isChecked={isChecked}
      isDisabled={isDisabled}
      isIndeterminate={isIndeterminate}
      onChange={checked => {
        setIsChecked(checked);
        setIsIndeterminate(false);
      }}
    />
  );
};

const meta = {
  args: { isChecked: false, isDisabled: false, isIndeterminate: false },
  component: CheckboxPlayground,
  title: 'Components/Checkbox',
} satisfies Meta<typeof CheckboxPlayground>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: { isChecked: true },
};

export const Indeterminate: Story = {
  args: { isIndeterminate: true },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};
