import { useMemo } from 'react';
import { giftingActivityAdapter, useGetGiftingActivityByGroupIdQuery } from '@alycecom/services';
import { useSelector } from 'react-redux';

import { getDateRange } from '../store/ui/overviewFilters/overviewFilters.selectors';
import { transformGiftingActivityGroups } from '../helpers/billingGroupForm.helpers';
import { TGiftingActivityGroupNode } from '../types';

export type TUseGetGiftingActivityByGroupValue = {
  isFetching: boolean;
  items: TGiftingActivityGroupNode[];
};

export const useGetGiftingActivityByGroup = (id?: string | number): TUseGetGiftingActivityByGroupValue => {
  const { from, to } = useSelector(getDateRange);

  const skip = !id;
  const requestParams = {
    groupId: String(id),
    filters: from && to ? { dateRange: { from, to } } : undefined,
  };

  const { data, isFetching } = useGetGiftingActivityByGroupIdQuery(requestParams, {
    refetchOnMountOrArgChange: true,
    skip,
  });

  const { selectAll } = giftingActivityAdapter.getSelectors(() => data ?? giftingActivityAdapter.getInitialState());

  const groups = useSelector(selectAll);

  const items = useMemo(() => transformGiftingActivityGroups(groups), [groups]);

  return {
    isFetching,
    items,
  };
};
