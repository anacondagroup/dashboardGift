import { TAcceptedGiftByEmailDomain, useGetAcceptedGiftsByEmailDomainQuery } from '@alycecom/services';

import { transformRoiFilters } from '../utils/transformRoiFilters';

import { TDebouncedFilters } from './useRoiTable/useRoiTable';
import { useWaitValidFilters } from './useWaitValidFilters';

export type TUseGetAcceptedGiftsByEmailDomainParams = {
  emailDomain: string;
  filters: TDebouncedFilters<TAcceptedGiftByEmailDomain>;
};

export const useGetAcceptedGiftsByEmailDomain = ({
  emailDomain,
  filters,
}: TUseGetAcceptedGiftsByEmailDomainParams): ReturnType<typeof useGetAcceptedGiftsByEmailDomainQuery> & {
  isWaitingForFilters: boolean;
} => {
  const isWaitingForFilters = useWaitValidFilters(filters);
  const queryResult = useGetAcceptedGiftsByEmailDomainQuery(
    {
      filters: transformRoiFilters(filters),
      emailDomain,
    },
    { skip: isWaitingForFilters },
  );

  return {
    ...queryResult,
    isWaitingForFilters,
  };
};
