import type { IconName } from '../icon';

export type CoverProps = {
  icon: IconName;
  isSelected?: boolean;
  /** Any string the color is derived from. The same seed always gives the same color. */
  seed: string;
};
