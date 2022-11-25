import { useEffect, useRef } from 'react';
import { TGlobalRoiFilters } from '@alycecom/services';

export const useWaitValidFilters = (filters: TGlobalRoiFilters): boolean => {
  const wasInitialRequestMadeRef = useRef(false);

  useEffect(() => {
    if (filters.teamIds.length) {
      wasInitialRequestMadeRef.current = true;
    }
  }, [filters.teamIds]);

  return wasInitialRequestMadeRef.current ? false : filters.teamIds.length === 0;
};
