import type { ReactNode } from 'react';

export type BottomSheetProps = {
  children: ReactNode;
  closeLabel: string;
  footer?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};
