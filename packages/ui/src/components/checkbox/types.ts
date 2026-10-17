export type CheckboxProps = {
  accessibilityLabel: string;
  isChecked: boolean;
  isDisabled?: boolean;
  isIndeterminate?: boolean;
  onChange: (isChecked: boolean) => void;
};
