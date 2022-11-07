import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';

import {
  getSwagCampaignProductTypes,
  getSwagCampaignProductTypesIsLoading,
  getSwagCampaignDefaultProductId,
} from '../store/campaign/swagInvites/swagInvites.selectors';
import {
  loadCampaignSwagProductTypesRequest,
  updateCampaignSwagProductTypesRequest,
} from '../store/campaign/swagInvites/swagInvites.actions';

export const useSwagProductTypes = campaignId => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadCampaignSwagProductTypesRequest(campaignId));
  }, [campaignId, dispatch]);

  const isLoading = useSelector(getSwagCampaignProductTypesIsLoading);
  const productTypes = useSelector(getSwagCampaignProductTypes);
  const defaultProduct = useSelector(getSwagCampaignDefaultProductId);
  const update = useCallback(
    ({ restrictedProductIds, defaultProductId }) =>
      dispatch(
        updateCampaignSwagProductTypesRequest({
          restrictedProductIds,
          defaultProductId,
          campaignId,
        }),
      ),
    [campaignId, dispatch],
  );
  return {
    isLoading,
    productTypes,
    update,
    defaultProduct,
  };
};
