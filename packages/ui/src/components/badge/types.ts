import type { ValueOf } from 'type-fest';
import type { IconName } from '../icon';

export const BadgeColor = {
  /** Errors, e.g. a failed download or the number of them. */
  Danger: 'danger',
  /** Ongoing activity, e.g. a download in progress or the number of them. */
  Info: 'info',
  /** Passive state, e.g. "Offline", queued or not downloaded. */
  Neutral: 'neutral',
  /** Finished successfully, e.g. a downloaded track. */
  Success: 'success',
} as const;
export type BadgeColors = ValueOf<typeof BadgeColor>;

type BadgeBaseProps = {
  color?: BadgeColors;
  isIconFilled?: boolean;
};

type BadgeWithLabelProps = BadgeBaseProps & {
  accessibilityLabel?: never;
  children: string;
  icon?: IconName;
  isNumeric?: boolean;
};

type BadgeIconOnlyProps = BadgeBaseProps & {
  accessibilityLabel: string;
  children?: never;
  icon: IconName;
  isNumeric?: never;
};

export type BadgeProps = BadgeIconOnlyProps | BadgeWithLabelProps;
