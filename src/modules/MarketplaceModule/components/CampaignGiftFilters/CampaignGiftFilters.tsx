import React, { memo } from 'react';
import { useSelector } from 'react-redux';

import { RestrictionFilters } from '../RestrictionFilters';
import {
  getHiddenGiftFilters,
  getIsLoading,
  getRestrictedTypeIds,
  getRestrictedVendorIds,
} from '../../store/campaignSettings/campaignSettings.selectors';
import { getCampaignMarketplaceHasChanges } from '../../store/marketplace.selectors';
import { IProductsFilters } from '../../store/products/products.types';

export interface ICampaignGiftFiltersProps {
  onReset: () => void;
  submitForm: (filters: IProductsFilters) => void;
}

const CampaignGiftFilters = ({ onReset, submitForm }: ICampaignGiftFiltersProps): JSX.Element => {
  const isCampaignSettingsLoading = useSelector(getIsLoading);
  const restrictedVendorsIds = useSelector(getRestrictedVendorIds);
  const restrictedTypeIds = useSelector(getRestrictedTypeIds);
  const hasChanges = useSelector(getCampaignMarketplaceHasChanges);
  const hiddenFilters = useSelector(getHiddenGiftFilters);

  return (
    <RestrictionFilters
      loading={isCampaignSettingsLoading}
      hiddenFilters={hiddenFilters}
      hasChanges={hasChanges}
      onReset={onReset}
      restrictedTypeIds={restrictedTypeIds}
      restrictedVendorIds={restrictedVendorsIds}
      submitForm={submitForm}
    />
  );
};

export default memo(CampaignGiftFilters);
