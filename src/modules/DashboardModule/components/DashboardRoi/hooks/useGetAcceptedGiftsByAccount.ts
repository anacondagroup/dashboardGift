import { TAcceptedGiftByEmailDomain, useGetAcceptedGiftsByAccountQuery } from '@alycecom/services';

import { transformRoiFilters } from '../utils/transformRoiFilters';

import { TDebouncedFilters } from './useRoiTable/useRoiTable';
import { useWaitValidFilters } from './useWaitValidFilters';

export type TUseGetAcceptedGiftsByAccountParams = {
  accountId: string;
  filters: TDebouncedFilters<TAcceptedGiftByEmailDomain>;
};

export const useGetAcceptedGiftsByAccount = ({
  accountId,
  filters,
}: TUseGetAcceptedGiftsByAccountParams): ReturnType<typeof useGetAcceptedGiftsByAccountQuery> & {
  isWaitingForFilters: boolean;
} => {
  const isWaitingForFilters = useWaitValidFilters(filters);
  const queryResult = useGetAcceptedGiftsByAccountQuery(
    {
      filters: transformRoiFilters(filters),
      accountId,
    },
    { skip: isWaitingForFilters },
  );

  return {
    ...queryResult,
    isWaitingForFilters,
  };
};
