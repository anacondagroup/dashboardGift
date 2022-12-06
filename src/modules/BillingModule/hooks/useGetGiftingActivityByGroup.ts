import { giftingActivityAdapter, useGetGiftingActivityByGroupIdQuery } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { Dictionary, EntityId } from '@reduxjs/toolkit';

import { getDateRange } from '../store/ui/overviewFilters/overviewFilters.selectors';
import { transformGiftingActivityGroupsToMap } from '../helpers/billingGroupForm.helpers';
import { TGiftingActivityGroupNode } from '../types';

export type TUseGetGiftingActivityByGroupValue = {
  isFetching: boolean;
  entities: Dictionary<TGiftingActivityGroupNode>;
  ids: EntityId[];
};

export const useGetGiftingActivityByGroup = (id: string | number): TUseGetGiftingActivityByGroupValue => {
  const { from, to } = useSelector(getDateRange);

  const skip = !id;
  const requestParams = {
    groupId: String(id),
    filters: from && to ? { dateRange: { from, to } } : undefined,
  };

  const { entities, selectIds, isFetching } = useGetGiftingActivityByGroupIdQuery(requestParams, {
    selectFromResult: result => ({
      ...result,
      ...giftingActivityAdapter.getSelectors(() => result?.data ?? giftingActivityAdapter.getInitialState()),
      entities: transformGiftingActivityGroupsToMap(result.data?.entities ?? {}),
    }),
    refetchOnMountOrArgChange: true,
    skip,
  });

  const ids = useSelector(selectIds);

  return {
    isFetching,
    ids,
    entities,
  };
};
