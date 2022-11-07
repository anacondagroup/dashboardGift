import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { CampaignSettings } from '@alycecom/modules';

import { loadOAuthState } from '../modules/SettingsModule/store/organisation/integrations/salesforce/sfOauth.actions';
import { getIsSfConnected } from '../modules/SettingsModule/store/organisation/integrations/salesforce/sfOAuth.selectors';

interface IConnectToSFHook {
  handleConnectSFCampaign: () => void;
  isConnectToSFSectionDisplayed: boolean;
}

const useConnectToSf = (campaignId?: number | null): IConnectToSFHook => {
  const isConnectToSFSectionDisplayed = useSelector(getIsSfConnected);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadOAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (isConnectToSFSectionDisplayed && campaignId) {
      dispatch(CampaignSettings.actions.loadCampaignConnectionToSFStatus(campaignId));
    }
  }, [dispatch, isConnectToSFSectionDisplayed, campaignId]);

  const handleConnectSFCampaign = useCallback(() => {
    if (campaignId) {
      dispatch(CampaignSettings.actions.connectCampaignToSFById(campaignId));
    }
  }, [campaignId, dispatch]);

  return useMemo(() => ({ handleConnectSFCampaign, isConnectToSFSectionDisplayed }), [
    handleConnectSFCampaign,
    isConnectToSFSectionDisplayed,
  ]);
};

export default useConnectToSf;
