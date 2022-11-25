import { TInfluencedOpportunities, useGetInfluencedOpportunitiesQuery } from '@alycecom/services';

import { transformRoiFilters } from '../utils/transformRoiFilters';

import { TDebouncedFilters } from './useRoiTable/useRoiTable';
import { useWaitValidFilters } from './useWaitValidFilters';

export const useGetInfluencedOpportunities = (
  filters: TDebouncedFilters<TInfluencedOpportunities>,
): ReturnType<typeof useGetInfluencedOpportunitiesQuery> & {
  isWaitingForFilters: boolean;
} => {
  const isWaitingForFilters = useWaitValidFilters(filters);
  const queryResult = useGetInfluencedOpportunitiesQuery(transformRoiFilters(filters), { skip: isWaitingForFilters });

  return {
    ...queryResult,
    isWaitingForFilters,
  };
};
