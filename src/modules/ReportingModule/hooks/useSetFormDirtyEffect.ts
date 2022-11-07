import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setIsFormDirty } from '../store/reportingSidebar/reportingSidebar.actions';

export const useSetFormDirtyEffect = ({ isDirty }: { isDirty: boolean }): void => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsFormDirty(isDirty));
  }, [isDirty, dispatch]);
};
