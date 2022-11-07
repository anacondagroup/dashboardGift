import React from 'react';
import { CampaignSettings } from '@alycecom/modules';
import { Tab } from '@mui/material';
import { useHistory, Redirect, Route, Switch } from 'react-router-dom';

import DetailsTab from '../DetailsTab/DetailsTab';
import GiftTab from '../GiftTab/GiftTab';
import MessagingTab from '../MessagingTab/MessagingTab';
import { useActivate } from '../../../hooks/useActivate';
import { ActivateCampaignRoutes, ActivateEditorStep, ActivateEditorTab } from '../../../routePaths';

const SettingsTab = (): JSX.Element => {
  const history = useHistory();
  const { campaignId: id, tab: currentTab } = useActivate();
  const campaignId = Number(id);

  const handleChange = (event: React.ChangeEvent<unknown>, tabValue: ActivateEditorTab) => {
    if (!campaignId) {
      return;
    }
    history.push(ActivateCampaignRoutes.buildEditorUrl(campaignId, ActivateEditorStep.Settings, tabValue));
  };

  return (
    <CampaignSettings.Layout2Columns
      leftSection={
        <CampaignSettings.LeftSectionNav
          tabs={[
            <Tab key={0} label="Details" value={ActivateEditorTab.Details} disableTouchRipple />,
            <Tab key={1} label="Gift" value={ActivateEditorTab.Gift} disableTouchRipple />,
            <Tab key={2} label="Messaging" value={ActivateEditorTab.Messaging} disableTouchRipple />,
          ]}
          TabsProps={{
            value: currentTab,
            onChange: handleChange,
          }}
        />
      }
      stickySection
      stickyBoundaryTop="CampaignLayout-LeftSectionTopBoundaryId"
    >
      <Switch>
        <Route exact path={ActivateCampaignRoutes.buildEditorUrl(campaignId, ActivateEditorStep.Settings)}>
          <Redirect
            to={ActivateCampaignRoutes.buildEditorUrl(
              campaignId,
              ActivateEditorStep.Settings,
              ActivateEditorTab.Details,
            )}
          />
        </Route>
        <Route
          path={ActivateCampaignRoutes.buildEditorUrl(
            campaignId,
            ActivateEditorStep.Settings,
            ActivateEditorTab.Details,
          )}
          component={DetailsTab}
        />
        <Route
          path={ActivateCampaignRoutes.buildEditorUrl(campaignId, ActivateEditorStep.Settings, ActivateEditorTab.Gift)}
          component={GiftTab}
        />
        <Route
          path={ActivateCampaignRoutes.buildEditorUrl(
            campaignId,
            ActivateEditorStep.Settings,
            ActivateEditorTab.Messaging,
          )}
          component={MessagingTab}
        />
      </Switch>
    </CampaignSettings.Layout2Columns>
  );
};

export default SettingsTab;
