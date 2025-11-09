import { useContext } from 'react';
import { ConfirmDialogContext } from './context';
import type { UseConfirmDialogReturn } from './types';

export const useConfirmDialog = (): UseConfirmDialogReturn => {
  const actions = useContext(ConfirmDialogContext);
  if (!actions) {
    throw Error('Missing provider. Hook useConfirmDialog must be used inside ConfirmDialogProvider.');
  }

  return actions;
};
