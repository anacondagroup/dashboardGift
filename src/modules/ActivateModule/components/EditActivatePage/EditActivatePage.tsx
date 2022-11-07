import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CampaignSettings, Features } from '@alycecom/modules';
import { Link as MuiLink, Skeleton, Tab, Box } from '@mui/material';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';

import { loadActivateRequest } from '../../store/activate.actions';
import { useActivate } from '../../hooks/useActivate';
import { ActivateCampaignRoutes, ActivateModes, ActivateEditorStep, ActivateEditorTab } from '../../routePaths';
import { getActivateCampaignSourceType } from '../../store/steps/recipients/contacts';
import { getCampaignName, getIsFreeClaimEnabled } from '../../store/steps/details';
import { getIsActivateFulfilled } from '../../store/ui/status/status.selectors';
import { MARKETPLACE_ROUTES } from '../../../MarketplaceModule/routePaths';

import RecipientTab from './RecipientTab/RecipientTab';
import GiftLinksTab from './GiftLinksTab/GiftLinksTab';
import SettingsTab from './SettingsTab/SettingsTab';

const EditActivatePage = (): JSX.Element => {
  const dispatch = useDispatch();
  const { push } = useHistory();

  const { campaignId: id, step, tab } = useActivate();
  const campaignId = Number(id);

  const isMultipleLinksEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.MULTIPLE_GIFT_LINKS));
  const isPageLoaded = useSelector(getIsActivateFulfilled);
  const sourceType = useSelector(getActivateCampaignSourceType);
  const name = useSelector(getCampaignName);
  const isFreeClaimEnabled = useSelector(getIsFreeClaimEnabled);

  const handleChange = (event: React.ChangeEvent<unknown>, tabValue: ActivateEditorStep) => {
    if (!campaignId) {
      return;
    }
    push(ActivateCampaignRoutes.buildEditorUrl(campaignId, tabValue));
  };

  useEffect(() => {
    if (campaignId) {
      dispatch(loadActivateRequest({ campaignId, mode: ActivateModes.Editor }));
    }
  }, [dispatch, campaignId]);

  const isReady = campaignId && isPageLoaded;

  const defaultStep = sourceType || isFreeClaimEnabled ? ActivateEditorStep.Settings : ActivateEditorStep.Recipients;
  const currentStep = isReady && step ? step : defaultStep;

  const defaultTab = sourceType || isFreeClaimEnabled ? ActivateEditorTab.Details : undefined;
  const currentTab = isReady && tab ? tab : defaultTab;

  return (
    <CampaignSettings.BuilderThemeProvider theme="chambray" background={CampaignSettings.BuilderBackground.ONE_TO_MANY}>
      <CampaignSettings.EditContainer loading={!isPageLoaded}>
        <CampaignSettings.EditHeader
          title={isPageLoaded ? name : <Skeleton variant="text" width={150} />}
          subtitle="1:Many Campaign"
          toolbar={{
            left: (
              <MuiLink component={Link} to="/settings/campaigns">
                &lt; Back to Campaign Settings
              </MuiLink>
            ),
          }}
          tabs={[
            <Tab
              key={0}
              label={`Gift Link${isMultipleLinksEnabled ? 's' : ''}`}
              value={ActivateEditorStep.GiftLinks}
            />,
            <Tab key={1} label="Recipients" value={ActivateEditorStep.Recipients} />,
            <Tab key={2} label="Settings" value={ActivateEditorStep.Settings} />,
          ]}
          navBar={{
            right: (
              <Box display="flex" alignItems="center">
                <Box fontWeight={700}>Preview:</Box>
                &nbsp;
                <MuiLink href={MARKETPLACE_ROUTES.buildCampaignPath(campaignId)} target="_blank">
                  Marketplace
                </MuiLink>
                &nbsp;|&nbsp;
                <MuiLink href={`${window.APP_CONFIG.apiHost}/api/v1/campaigns/${campaignId}/preview`} target="_blank">
                  Recipient Experience
                </MuiLink>
              </Box>
            ),
          }}
          TabsProps={{
            value: currentStep,
            onChange: handleChange,
          }}
          sticky
          stickyContainerId="CampaignLayout-LeftSectionTopBoundaryId"
        />

        <Switch>
          <Route exact path={ActivateCampaignRoutes.buildEditorUrl(campaignId)}>
            <Redirect
              to={ActivateCampaignRoutes.buildEditorUrl(campaignId, currentStep as ActivateEditorStep, currentTab)}
            />
          </Route>
          <Route
            path={ActivateCampaignRoutes.buildEditorUrl(campaignId, ActivateEditorStep.Recipients)}
            component={RecipientTab}
          />
          <Route
            path={ActivateCampaignRoutes.buildEditorUrl(campaignId, ActivateEditorStep.GiftLinks)}
            component={GiftLinksTab}
          />
          <Route
            path={ActivateCampaignRoutes.buildEditorUrl(campaignId, ActivateEditorStep.Settings)}
            component={SettingsTab}
          />
        </Switch>
      </CampaignSettings.EditContainer>
    </CampaignSettings.BuilderThemeProvider>
  );
};

export default EditActivatePage;
