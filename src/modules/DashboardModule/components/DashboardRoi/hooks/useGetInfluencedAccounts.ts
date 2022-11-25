import { TInfluencedAccounts, useGetInfluencedAccountsQuery } from '@alycecom/services';

import { transformRoiFilters } from '../utils/transformRoiFilters';

import { TDebouncedFilters } from './useRoiTable/useRoiTable';
import { useWaitValidFilters } from './useWaitValidFilters';

export const useGetInfluencedAccounts = (
  filters: TDebouncedFilters<TInfluencedAccounts>,
): ReturnType<typeof useGetInfluencedAccountsQuery> & {
  isWaitingForFilters: boolean;
} => {
  const isWaitingForFilters = useWaitValidFilters(filters);
  const queryResult = useGetInfluencedAccountsQuery(transformRoiFilters(filters), { skip: isWaitingForFilters });

  return {
    ...queryResult,
    isWaitingForFilters,
  };
};
