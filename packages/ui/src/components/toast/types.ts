import type { IconName } from '../icon';

type ToastBaseProps = {
  icon: IconName;
  message: string;
};

type ToastWithActionProps = ToastBaseProps & {
  actionLabel: string;
  onAction: () => void;
};

type ToastWithoutActionProps = ToastBaseProps & {
  actionLabel?: never;
  onAction?: never;
};

export type ToastProps = ToastWithActionProps | ToastWithoutActionProps;
