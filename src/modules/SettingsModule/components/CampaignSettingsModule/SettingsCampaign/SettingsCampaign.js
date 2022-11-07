import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { Box } from '@mui/material';

import {
  commonCampaignSettingsDataRequest,
  commonCampaignSettingsClearData,
} from '../../../store/campaign/commonData/commonData.actions';
import { getCommonCampaignData } from '../../../store/campaign/commonData/commonData.selectors';
import SettingsCampaignHeader from '../../StandardCampaignModule/SettingsCampaignHeader/SettingsCampaignHeader';
import CreateCampaignSidebar from '../CreateCampaignSidebar/CreateCampaignSidebar';

import SettingsAndPermissions from './SettingsAndPermissions/SettingsAndPermissions';
import { LandingPageMessage } from './LandingPageMessage/LandingPageMessage';

const SettingsCampaign = ({ campaignId, url }) => {
  const dispatch = useDispatch();
  const campaign = useSelector(getCommonCampaignData);
  useEffect(() => {
    dispatch(commonCampaignSettingsDataRequest(campaignId));
    return () => {
      dispatch(commonCampaignSettingsClearData());
    };
  }, [dispatch, campaignId]);

  if (!campaign) {
    return null;
  }

  return (
    <Box>
      <CreateCampaignSidebar />
      <SettingsCampaignHeader name={campaign.name} />
      <Box>
        <Route exact path={url} render={() => <Redirect to={`${url}/settings-and-permissions`} />} />
        <Route
          path={`${url}/settings-and-permissions`}
          render={({ location: { pathname } }) => (
            <SettingsAndPermissions campaign={campaign} parentUrl={url} url={pathname} />
          )}
        />
        <Route
          path={`${url}/landing-page-message`}
          render={() => (
            <Box p={4}>
              <LandingPageMessage campaignId={parseInt(campaignId, 10)} />
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};

SettingsCampaign.propTypes = {
  url: PropTypes.string.isRequired,
  campaignId: PropTypes.number.isRequired,
};

export default SettingsCampaign;
