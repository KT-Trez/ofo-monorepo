import type { ValueOf } from 'type-fest';
import type { IconName } from '../icon';

export const IconButtonSize = {
  /** 56 px: previous/next in the player, metronome controls. */
  Lg: 'lg',
  /** 44 px, the default: top bar, list rows, mini-player. */
  Md: 'md',
  /** 36 px: toolbars, the selection bar, sheet close button. */
  Sm: 'sm',
  /** 72 px: only the main round play button in the player. */
  Xl: 'xl',
} as const;
export type IconButtonSizes = ValueOf<typeof IconButtonSize>;

export const IconButtonVariant = {
  /** Amber, for the main playback action (play in the player and the metronome). */
  Accent: 'accent',
  /** Transparent, the default: top bar, rows, player transport. */
  Ghost: 'ghost',
  /** On the inverse surface, e.g. actions in the selection bar. */
  Inverse: 'inverse',
  /** Neutral surface, for icon actions that need a visible shape (toolbars, sheet close). */
  Tonal: 'tonal',
} as const;
export type IconButtonVariants = ValueOf<typeof IconButtonVariant>;

export type IconButtonProps = {
  /** Required, since the button has no visible text. */
  accessibilityLabel: string;
  icon: IconName;
  /** Toggle on: amber icon and a filled glyph (autoplay, metronome). */
  isActive?: boolean;
  isDisabled?: boolean;
  /** Filled glyph; defaults to `isActive`. */
  isFilled?: boolean;
  /** Circle instead of a rounded square. Only for the main play buttons and the sheet close button. */
  isRound?: boolean;
  onLongPress?: () => void;
  onPress?: () => void;
  /** Defaults to `md`. */
  size?: IconButtonSizes;
  /** Defaults to `ghost`. */
  variant?: IconButtonVariants;
};
