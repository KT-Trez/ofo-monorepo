export type SwitchProps = {
  accessibilityLabel: string;
  isChecked: boolean;
  isDisabled?: boolean;
  onChange: (isChecked: boolean) => void;
};
