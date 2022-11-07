import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';
import { useRouting } from '@alycecom/hooks';
import { useSelector } from 'react-redux';

import GiftInvitesSettings from '../../../CampaignSettings/GiftInvitesSettings/GiftInvitesSettings';
import GiftInvitesSettingsLoader from '../../hoc/GiftInvitesSettingsLoader';
import GeneralSettings from '../../../CampaignSettings/GeneralSettings/GeneralSettings';
import SwagInvitesSettings from '../../../CampaignSettings/SwagInvitesSettings/SwagInvitesSettings';
import SwagCodesSettings from '../../SwagCodesSettings/SwagCodesSettings';
import { LandingPageMessage } from '../LandingPageMessage/LandingPageMessage';
import CampaignPreviewLinks from '../../../../../../components/Shared/CampaignPreviewLinks/CampaignPreviewLinks';
import { getIsArchived } from '../../../../store/campaign/commonData/commonData.selectors';

import Template from './Template/Template';

const SettingsAndPermissions = ({ parentUrl, campaign, url }) => {
  const go = useRouting();
  const isArchived = useSelector(getIsArchived);

  const settingsTabs = useMemo(() => {
    if (!campaign) {
      return [];
    }

    let tabs = [<Tab key="general" label="General" value={`${parentUrl}/settings-and-permissions/general`} />];
    if (campaign && campaign.type && campaign.type.includes('swag')) {
      tabs = [
        ...tabs,
        <Tab key="swag-invites" label="Swag Invites" value={`${parentUrl}/settings-and-permissions/swag-invites`} />,
        <Tab
          key="swag-code-inventory"
          label={campaign.type.includes('digital') ? 'Codes' : 'Redemption Cards'}
          value={`${parentUrl}/settings-and-permissions/code-inventory`}
        />,
        <Tab
          key="landing-page-message"
          label="Landing Page Message"
          value={`${parentUrl}/settings-and-permissions/landing-page-message`}
        />,
      ];
    } else if (campaign && campaign.type && campaign.type.includes('activate')) {
      tabs = [
        ...tabs,
        <Tab key="gift-invites" label="Gift Invites" value={`${parentUrl}/settings-and-permissions/gift-invites`} />,
        <Tab
          key="landing-page-message"
          label="Landing Page Message"
          value={`${parentUrl}/settings-and-permissions/landing-page-message`}
        />,
      ];
    } else {
      tabs = [
        ...tabs,
        <Tab key="gift-invites" label="Gift Invites" value={`${parentUrl}/settings-and-permissions/gift-invites`} />,
        <Tab
          key="default-message"
          label="Default Message"
          value={`${parentUrl}/settings-and-permissions/default-message`}
        />,
      ];
    }
    return [...tabs, <Tab key="empty" value={`${parentUrl}/settings-and-permissions`} style={{ display: 'none' }} />];
  }, [campaign, parentUrl]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pl="175px"
        pr="191px"
        bgcolor="common.white"
        boxShadow="0 2px 8px 0 rgba(0, 0, 0, 0.1)"
      >
        <Box>
          <Tabs value={url} onChange={(event, tabValue) => go(tabValue)} indicatorColor="primary" textColor="primary">
            {settingsTabs}
          </Tabs>
        </Box>
        {!isArchived && <CampaignPreviewLinks campaignId={campaign.id} />}
      </Box>
      <Box width="calc(100% - 350px)" margin="auto" bgcolor="common.white" boxShadow="0 2px 8px 0 rgba(0, 0, 0, 0.1)">
        <Route
          exact
          path={`${parentUrl}/settings-and-permissions/`}
          render={() => <Redirect to={`${parentUrl}/settings-and-permissions/general`} />}
        />
        <Route
          exact
          path={`${parentUrl}/settings-and-permissions/general`}
          render={() => <GeneralSettings campaignId={campaign.id} />}
        />
        <Route
          exact
          path={`${parentUrl}/settings-and-permissions/default-message`}
          render={() => (
            <Box p={4} borderTop="solid 1px var(--Tundora-20)">
              <Template campaignId={campaign.id} />
            </Box>
          )}
        />
        <Route
          exact
          path={`${parentUrl}/settings-and-permissions/code-inventory`}
          render={() => (
            <SwagCodesSettings campaignId={campaign.id} campaignName={campaign.name} campaignType={campaign.type} />
          )}
        />
        <Route
          exact
          path={`${parentUrl}/settings-and-permissions/landing-page-message`}
          render={() => (
            <Box p={4} borderTop="solid 1px var(--Tundora-20)">
              <LandingPageMessage campaignId={campaign.id} />
            </Box>
          )}
        />
        <Route
          exact
          path={`${parentUrl}/settings-and-permissions/gift-invites`}
          render={() => (
            <GiftInvitesSettingsLoader
              campaignId={campaign.id}
              render={({
                campaign: campaignSettings,
                isLoading,
                onSaveBudget,
                onSaveRequiredActions,
                onSaveGiftExpiration,
                onSaveGiftRedirect,
                onSaveGiftVideo,
                invitesErrors,
                currency,
                campaignCurrencies,
                customisation,
              }) => (
                <GiftInvitesSettings
                  campaignId={campaign.id}
                  campaignType={campaign.type}
                  campaign={campaignSettings}
                  customisation={customisation}
                  campaignName={campaign.name}
                  isLoading={isLoading}
                  teamId={campaign.team_id}
                  invitesErrors={invitesErrors}
                  onSaveBudget={onSaveBudget}
                  onSaveGiftRedirect={onSaveGiftRedirect}
                  onSaveGiftVideo={onSaveGiftVideo}
                  onSaveRequiredActions={onSaveRequiredActions}
                  onSaveGiftExpiration={onSaveGiftExpiration}
                  currency={currency}
                  campaignCurrencies={campaignCurrencies}
                />
              )}
            />
          )}
        />
        {campaign && (
          <Route
            exact
            path={`${parentUrl}/settings-and-permissions/swag-invites`}
            render={() => <SwagInvitesSettings campaign={campaign} />}
          />
        )}
      </Box>
    </>
  );
};

SettingsAndPermissions.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  campaign: PropTypes.object.isRequired,
  parentUrl: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default SettingsAndPermissions;
