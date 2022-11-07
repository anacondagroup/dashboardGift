import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { CampaignSettings, Features } from '@alycecom/modules';
import { Link as MuiLink, Tab, Skeleton, Box } from '@mui/material';

import { useProspecting } from '../../hooks';
import {
  fetchProspectingById,
  resetProspectingCampaign,
} from '../../store/prospectingCampaign/prospectingCampaign.actions';
import { ProspectingCampaignRoutes, ProspectingEditorStep } from '../../routePaths';
import { EditorInvitesPage } from '../EditorInvitesPage';
import { EditorSettingsPage } from '../EditorSettingsPage';
import { EDITOR_HEADER_BOUNDARY_ID } from '../../constants/ids';
import { getDetailsData } from '../../store/prospectingCampaign/steps/details/details.selectors';
import { getIsProspectingPending } from '../../store/prospectingCampaign/ui/status/status.selectors';
import { MARKETPLACE_ROUTES } from '../../../MarketplaceModule/routePaths';

import EditorFooterPortalPlacement from './components/EditorFooter/EditorFooterPortalPlacement';

const EditProspectingCampaignPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const { step, campaignId } = useProspecting();
  const history = useHistory();

  const { campaignName = '' } = useSelector(getDetailsData) || {};
  const isPending = useSelector(getIsProspectingPending);

  const hasBudgetManagementSetup = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP),
  );
  const hasBudgetManagementLimit = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_LIMIT),
  );
  const hasBudgetFlagsEnabled = hasBudgetManagementSetup && hasBudgetManagementLimit;

  const handleStepChange = (_: unknown, value: ProspectingEditorStep) => {
    if (campaignId) {
      history.push(ProspectingCampaignRoutes.buildEditorUrl(campaignId, value));
    }
  };

  useEffect(() => {
    if (campaignId) {
      dispatch(fetchProspectingById(campaignId));
    }
  }, [campaignId, dispatch]);

  useEffect(
    () => () => {
      dispatch(resetProspectingCampaign());
    },
    [dispatch],
  );

  if (!campaignId) {
    return <></>;
  }

  const tabs = [
    <Tab label="Invites" key={0} value={ProspectingEditorStep.Invites} />,
    <Tab label="Settings" key={1} value={ProspectingEditorStep.Settings} />,
  ];

  if (hasBudgetFlagsEnabled) {
    tabs.shift();
  }

  return (
    <CampaignSettings.BuilderThemeProvider theme="chambray" background={CampaignSettings.BuilderBackground.PROSPECTING}>
      <CampaignSettings.EditContainer loading={isPending}>
        <CampaignSettings.EditHeader
          title={isPending ? <Skeleton variant="text" width={150} /> : campaignName}
          subtitle="Prospecting Campaign"
          toolbar={{
            left: (
              <MuiLink component={Link} to="/settings/campaigns">
                &lt; Back to Campaign Settings
              </MuiLink>
            ),
          }}
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
          tabs={tabs}
          TabsProps={{
            value: step,
            onChange: handleStepChange,
          }}
          sticky
          stickyContainerId={EDITOR_HEADER_BOUNDARY_ID}
        />
        <Switch>
          <Route exact path={ProspectingCampaignRoutes.buildEditorUrl(campaignId)}>
            <Redirect to={ProspectingCampaignRoutes.buildEditorUrl(campaignId, ProspectingEditorStep.Settings)} />
          </Route>
          <Route
            path={ProspectingCampaignRoutes.buildEditorUrl(campaignId, ProspectingEditorStep.Invites)}
            component={EditorInvitesPage}
          />
          <Route
            path={ProspectingCampaignRoutes.buildEditorUrl(campaignId, ProspectingEditorStep.Settings)}
            component={EditorSettingsPage}
          />
        </Switch>
        <EditorFooterPortalPlacement />
      </CampaignSettings.EditContainer>
    </CampaignSettings.BuilderThemeProvider>
  );
};

export default EditProspectingCampaignPage;
