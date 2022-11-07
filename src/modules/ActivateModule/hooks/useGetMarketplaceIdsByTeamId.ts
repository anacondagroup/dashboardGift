import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';

import { makeGetMarketplacesIdsByTeamAndCountry } from '../store/entities/customMarketplaces/customMarketplaces.selectors';

export const useGetMarketplaceIdsByTeamId = ({
  teamId,
  countryIds,
}: {
  teamId: EntityId | null | undefined;
  countryIds: number[] | null | undefined;
}): EntityId[] => {
  const getMarketplaceIdByTeamId = useMemo(
    () => (teamId && countryIds ? makeGetMarketplacesIdsByTeamAndCountry({ teamId, countryIds }) : () => []),
    [teamId, countryIds],
  );

  return useSelector(getMarketplaceIdByTeamId);
};
