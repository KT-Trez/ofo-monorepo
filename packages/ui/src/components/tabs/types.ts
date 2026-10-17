import type { LayoutChangeEvent } from 'react-native';
import type { ValueOf } from 'type-fest';
import type { IconName } from '../icon';

export type TabProps<TValue extends string> = {
  isFullwidth: boolean;
  isIconOnly: boolean;
  isSelected: boolean;
  onChange: (value: TValue) => void;
  onLayout: (event: LayoutChangeEvent, isSelected: boolean, option: TabsOption<TValue>) => void;
  option: TabsOption<TValue>;
  size: TabsSizes;
};

export const TabsSize = {
  /** 44 px, the default: tabs of a screen, e.g. playlists and tracks in the library. */
  Md: 'md',
  /** 36 px: pickers in settings rows and the metronome. */
  Sm: 'sm',
} as const;
export type TabsSizes = ValueOf<typeof TabsSize>;

export type TabsOption<TValue extends string> = {
  icon?: IconName;
  label: string;
  value: TValue;
};

type TabsBaseProps<TValue extends string> = {
  accessibilityLabel: string;
  isFullwidth?: boolean;
  onChange: (value: TValue) => void;
  size?: TabsSizes;
  value: TValue;
};

type TabsWithLabelsProps<TValue extends string> = TabsBaseProps<TValue> & {
  isIconOnly?: false;
  options: readonly TabsOption<TValue>[];
};

type TabsIconOnlyProps<TValue extends string> = TabsBaseProps<TValue> & {
  isIconOnly: true;
  options: readonly (TabsOption<TValue> & { icon: IconName })[];
};

export type TabsProps<TValue extends string> =
  | TabsIconOnlyProps<TValue>
  | TabsWithLabelsProps<TValue>;
