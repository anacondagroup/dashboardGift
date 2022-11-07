import { useCallback, useMemo, useState } from 'react';
import { EntityId } from '@alycecom/utils';

export type TUseTableRowCheckboxControllerValue<Idx extends EntityId> = {
  getIsIdxChecked: (id: Idx) => boolean;
  setIsIdxChecked: (idx: Idx, checked: boolean) => void;
  setIsAllChecked: (checked: boolean) => void;
  isAllChecked: boolean;
  isIndeterminate: boolean;
  checkedIdx: Idx[];
};

export const useTableRowCheckboxController = <Idx extends EntityId>(
  indexes: Idx[],
): TUseTableRowCheckboxControllerValue<Idx> => {
  const [checkedIdx, setCheckedIds] = useState(new Set<Idx>());

  const getIsIdxChecked = useCallback((id: Idx) => checkedIdx.has(id), [checkedIdx]);
  const setIsIdxChecked = useCallback(
    (id: Idx, checked: boolean) =>
      setCheckedIds(prev => {
        if (checked) {
          prev.add(id);
        } else {
          prev.delete(id);
        }
        return new Set(prev);
      }),
    [],
  );
  const setIsAllChecked = useCallback(
    (checked: boolean) => {
      if (checked) {
        setCheckedIds(new Set(indexes));
      } else {
        setCheckedIds(new Set<Idx>());
      }
    },
    [indexes],
  );

  const isAllChecked = checkedIdx.size === indexes.length;
  const isIndeterminate = checkedIdx.size !== 0 && !isAllChecked;
  const checkedIdxArray = useMemo(() => Array.from(checkedIdx), [checkedIdx]);

  return {
    getIsIdxChecked,
    setIsIdxChecked,
    setIsAllChecked,
    isAllChecked,
    isIndeterminate,
    checkedIdx: checkedIdxArray,
  };
};
