import { useCallback, useEffect, useRef } from 'react';

export const useTimeoutV2 = (callback: () => void, delay: number) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(callbackRef.current, delay);
  }, [delay]);

  useEffect(() => {
    set();
    return clear;
  }, [delay, clear, set]);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return {
    clear,
    reset,
  };
};
