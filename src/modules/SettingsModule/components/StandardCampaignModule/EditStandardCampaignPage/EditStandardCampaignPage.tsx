import React, { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import SettingsCampaign from '../../CampaignSettingsModule/SettingsCampaign/SettingsCampaign';
import { StandardCampaignRoutes } from '../routePaths';

const EditStandardCampaignPage = () => (
  <Switch>
    <Route
      path={StandardCampaignRoutes.editorPath}
      render={({
        match: {
          params: { campaignId = '' },
        },
      }) => (
        <SettingsCampaign
          campaignId={parseInt(campaignId, 10)}
          url={StandardCampaignRoutes.buildEditorUrl(parseInt(campaignId, 10))}
        />
      )}
    />
  </Switch>
);

export default memo(EditStandardCampaignPage);
