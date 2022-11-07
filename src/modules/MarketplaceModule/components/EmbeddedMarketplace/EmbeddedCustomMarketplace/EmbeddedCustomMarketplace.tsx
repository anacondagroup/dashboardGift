import React from 'react';
import { useSelector } from 'react-redux';
import { EntityId } from '@reduxjs/toolkit';

import { useLoadCustomMarketplace } from '../hooks/useLoadCustomMarketplace';
import { getRestrictedTypeIds } from '../../../store/customMarketplace/customMarketplace.selectors';
import EmbeddedBaseMarketplace, {
  IEmbeddedBaseMarketplaceProps,
} from '../EmbeddedBaseMarketplace/EmbeddedBaseMarketplace';

export interface IEmbeddedCustomMarketplaceProps extends Omit<IEmbeddedBaseMarketplaceProps, 'isReady'> {
  marketplaceId: number;
  teamId?: number;
  campaignId?: number;
  countryIds?: EntityId[];
}

const EmbeddedCustomMarketplace = ({
  marketplaceId,
  teamId,
  campaignId,
  countryIds,
  ...baseMarketplaceProps
}: IEmbeddedCustomMarketplaceProps): JSX.Element => {
  const { isLoaded } = useLoadCustomMarketplace({
    marketplaceId,
    campaignId,
    teamId,
    countryIds,
  });

  const restrictedTypeIds = useSelector(getRestrictedTypeIds);

  return (
    <EmbeddedBaseMarketplace
      {...baseMarketplaceProps}
      restrictedTypeIds={restrictedTypeIds as number[]}
      isReady={isLoaded}
      disableBudget
      syncBudget
    />
  );
};

export default EmbeddedCustomMarketplace;
