import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  campaignLandingPageMessageLoadRequest,
  updateCampaignLandingPageMessageRequest,
} from '../store/campaign/landingPage/landingPage.actions';
import {
  getCampaignLandingPageSettings,
  getCampaignLandingPageIsLoading,
  getCampaignLandingPageErrors,
} from '../store/campaign/landingPage/landingPage.selectors';

export default campaignId => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(campaignLandingPageMessageLoadRequest(campaignId));
  }, [campaignId, dispatch]);

  const settings = useSelector(getCampaignLandingPageSettings);
  const errors = useSelector(getCampaignLandingPageErrors);
  const isLoading = useSelector(getCampaignLandingPageIsLoading);

  const onSave = useCallback(
    ({ header, message }) => {
      dispatch(updateCampaignLandingPageMessageRequest({ campaignId, header, message }));
    },
    [campaignId, dispatch],
  );

  return {
    settings,
    errors,
    isLoading,
    onSave,
  };
};
