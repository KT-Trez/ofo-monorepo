import { useEffect, useState } from 'react';
import { useTimeoutV2 } from './useTimeout';

export const useConstDebounce = <T>(variable: T, delay: number) => {
  const [debouncedVariable, setDebouncedVariable] = useState(variable);
  const { clear, reset } = useTimeoutV2(() => setDebouncedVariable(variable), delay);

  useEffect(() => {
    if (!variable) return;

    clear();
    reset();
  }, [clear, reset, variable]);

  return debouncedVariable;
};
