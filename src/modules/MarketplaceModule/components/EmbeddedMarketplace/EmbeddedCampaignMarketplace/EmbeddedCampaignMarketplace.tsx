import React from 'react';
import { useSelector } from 'react-redux';

import { useLoadCampaignMarketplace } from '../hooks/useLoadCampaignMarketplace';
import EmbeddedBaseMarketplace, {
  IEmbeddedBaseMarketplaceProps,
} from '../EmbeddedBaseMarketplace/EmbeddedBaseMarketplace';
import { IFilters } from '../../../store/products/products.types';
import { getRestrictedTypeIds } from '../../../store/campaignSettings/campaignSettings.selectors';

export interface IEmbeddedCampaignMarketplaceProps
  extends Omit<IEmbeddedBaseMarketplaceProps, 'isReady' | 'disableBudget' | 'syncBudget'> {
  campaignId: number;
  initialFilters?: Partial<IFilters>;
}

export const EmbeddedCampaignMarketplace = ({
  campaignId,
  initialFilters,
  ...simpleMarketplaceProps
}: IEmbeddedCampaignMarketplaceProps): JSX.Element => {
  const { isLoaded } = useLoadCampaignMarketplace({ campaignId, initialFilters });
  const restrictedTypeIds = useSelector(getRestrictedTypeIds) as number[];

  return (
    <EmbeddedBaseMarketplace
      {...simpleMarketplaceProps}
      restrictedTypeIds={restrictedTypeIds}
      isReady={isLoaded}
      disableBudget
      syncBudget
    />
  );
};

export default EmbeddedCampaignMarketplace;
