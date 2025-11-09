import { createContext } from 'react';
import type { UseConfirmDialogReturn } from './types';

export const ConfirmDialogContext = createContext<UseConfirmDialogReturn | undefined>(undefined);
