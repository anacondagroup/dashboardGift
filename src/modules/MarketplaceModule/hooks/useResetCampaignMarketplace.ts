import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { UseFormReset } from 'react-hook-form';

import { getCampaignSettingsAsFilters } from '../store/campaignSettings/campaignSettings.selectors';
import { updateFilters } from '../store/products/products.actions';
import { TCampaignMarketplaceForm } from '../store/campaignSettings/campaignSettings.types';

export const useResetToCampaignValues = (reset: UseFormReset<TCampaignMarketplaceForm>): (() => void) => {
  const dispatch = useDispatch();
  const filters = useSelector(getCampaignSettingsAsFilters);

  return useCallback(() => {
    dispatch(updateFilters(filters));
    reset(filters);
  }, [dispatch, reset, filters]);
};
