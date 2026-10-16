import type { ValueOf } from 'type-fest';
import type { IconName } from '../icon';

export const ButtonSize = {
  /** 44 px, the default: actions in sheets and forms, usually full width or sharing a row. */
  Md: 'md',
  /** 36 px: secondary actions inline with other content, e.g. next to a section label or in a card. */
  Sm: 'sm',
} as const;
export type ButtonSizes = ValueOf<typeof ButtonSize>;

export const ButtonVariant = {
  /** Muted red action that removes or retries something, e.g. "Ponów". */
  Danger: 'danger',
  /** Transparent, for low-emphasis actions in toolbars and sheets. */
  Ghost: 'ghost',
  /** Transparent amber text on `surfaceInverse`, e.g. the action of a toast ("Cofnij"). */
  OnInverse: 'onInverse',
  /** Amber, for the single main action of a view. Only one per view. */
  Primary: 'primary',
  /** Neutral surface, for every other action. */
  Secondary: 'secondary',
} as const;
export type ButtonVariants = ValueOf<typeof ButtonVariant>;

export type ButtonProps = {
  /** Defaults to `children`. */
  accessibilityLabel?: string;
  /** The label: a single verb in the imperative, e.g. "Pobierz", "Zapisz", "Połącz". */
  children: string;
  /** Icon after the label; size and color follow the button. */
  iconEnd?: IconName;
  /** Icon before the label; size and color follow the button. */
  iconStart?: IconName;
  isDisabled?: boolean;
  /** Stretches the button to the full width of its container. */
  isFullwidth?: boolean;
  onLongPress?: () => void;
  onPress?: () => void;
  /** Defaults to `md`. */
  size?: ButtonSizes;
  /** Defaults to `primary`. */
  variant?: ButtonVariants;
};
