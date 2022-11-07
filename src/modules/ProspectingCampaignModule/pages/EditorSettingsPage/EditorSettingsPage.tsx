import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { CampaignSettings } from '@alycecom/modules';
import { Tab } from '@mui/material';

import { useProspecting } from '../../hooks';
import { ProspectingCampaignRoutes, ProspectingEditorStep, ProspectingEditorTabs } from '../../routePaths';
import { EDITOR_HEADER_BOUNDARY_ID } from '../../constants/ids';

import SettingsDetailsTab from './components/SettingsDetailsTab/SettingsDetailsTab';
import SettingsGiftTab from './components/SettingsGiftTab/SettingsGiftTab';
import SettingsMessagingTab from './components/SettingsMessagingTab/SettingsMessagingTab';

const EditorSettingsPage = (): JSX.Element => {
  const history = useHistory();
  const { tab, campaignId } = useProspecting();

  const handleTabChange = (_: unknown, value: ProspectingEditorTabs) => {
    if (!campaignId) {
      return;
    }
    history.push(ProspectingCampaignRoutes.buildEditorUrl(campaignId, ProspectingEditorStep.Settings, value));
  };

  if (!campaignId) {
    return <></>;
  }

  return (
    <CampaignSettings.Layout2Columns
      leftSection={
        <CampaignSettings.LeftSectionNav
          tabs={[
            <Tab key={0} label="Details" value={ProspectingEditorTabs.Details} disableTouchRipple />,
            <Tab key={1} label="Gift" value={ProspectingEditorTabs.Gift} disableTouchRipple />,
            <Tab key={2} label="Messaging" value={ProspectingEditorTabs.Messaging} disableTouchRipple />,
          ]}
          TabsProps={{
            value: tab,
            onChange: handleTabChange,
          }}
        />
      }
      stickySection
      stickyBoundaryTop={EDITOR_HEADER_BOUNDARY_ID}
    >
      <Switch>
        <Route exact path={ProspectingCampaignRoutes.buildEditorUrl(campaignId, ProspectingEditorStep.Settings)}>
          <Redirect
            to={ProspectingCampaignRoutes.buildEditorUrl(
              campaignId,
              ProspectingEditorStep.Settings,
              ProspectingEditorTabs.Details,
            )}
          />
        </Route>
        <Route
          path={ProspectingCampaignRoutes.buildEditorUrl(
            campaignId,
            ProspectingEditorStep.Settings,
            ProspectingEditorTabs.Details,
          )}
          component={SettingsDetailsTab}
        />
        <Route
          path={ProspectingCampaignRoutes.buildEditorUrl(
            campaignId,
            ProspectingEditorStep.Settings,
            ProspectingEditorTabs.Gift,
          )}
          component={SettingsGiftTab}
        />
        <Route
          path={ProspectingCampaignRoutes.buildEditorUrl(
            campaignId,
            ProspectingEditorStep.Settings,
            ProspectingEditorTabs.Messaging,
          )}
          component={SettingsMessagingTab}
        />
      </Switch>
    </CampaignSettings.Layout2Columns>
  );
};

export default EditorSettingsPage;
