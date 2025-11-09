import { useCallback, useMemo, useState } from 'react';

export const useSelected = <T>() => {
  const [selected, setSelected] = useState<Record<string, T>>({});

  const isAnythingSelected = useMemo<boolean>(() => Object.keys(selected).length !== 0, [selected]);

  const select = useCallback((id: string, item: T) => {
    setSelected(prev => ({ ...prev, [id]: item }));
  }, []);

  const selectAll = useCallback((items: Record<string, T>) => {
    setSelected(items);
  }, []);

  const toggleSelect = useCallback((id: string, item: T) => {
    setSelected(prev => {
      const isSelected = !!prev[id];

      if (isSelected) {
        const copy = { ...prev };
        delete copy[id];

        return copy;
      } else {
        return { ...prev, [id]: item };
      }
    });
  }, []);

  const toggleSelectAll = useCallback((items: Record<string, T>) => {
    setSelected(prev => {
      const isAnySelected = Object.keys(prev).length !== 0;

      if (isAnySelected) {
        return items;
      } else {
        return {};
      }
    });
  }, []);

  const unselect = useCallback((id: string) => {
    setSelected(prev => {
      const copy = { ...prev };
      delete copy[id];

      return copy;
    });
  }, []);

  const unselectAll = useCallback(() => {
    setSelected({});
  }, []);

  return {
    isAnythingSelected,
    select,
    selectAll,
    selected,
    toggleSelect,
    toggleSelectAll,
    unselect,
    unselectAll,
  };
};
