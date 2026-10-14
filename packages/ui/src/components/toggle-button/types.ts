import type { IconName } from '../icon';

export type ToggleButtonOption<TValue extends string> = {
  icon?: IconName;
  /** Visible text, or only the accessibility label when the group is `isIconOnly`. */
  label: string;
  value: TValue;
};

export type ToggleButtonProps<TValue extends string> = {
  /** Accessible name of the whole group, e.g. "Sortowanie". */
  accessibilityLabel: string;
  /** Shows only icons; labels move to the accessibility label. Every option then needs an `icon`. */
  isIconOnly?: boolean;
  onChange: (value: TValue) => void;
  /** 2–4 options. */
  options: readonly ToggleButtonOption<TValue>[];
  value: TValue;
};
