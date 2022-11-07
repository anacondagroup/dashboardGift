import React, { useMemo, useCallback, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  BaseSettingsItem,
  CommonData,
  SettingsItem,
  CampaignSettings,
  giftResearchFlowTypeNames,
} from '@alycecom/modules';

import {
  getCampaignGeneralSettings,
  getCampaignGeneralSettingsError,
  getCampaignGeneralSettingsIsLoading,
  getCampaignType,
  getIsStandard,
} from '../../../store/campaign/general/general.selectors';
import CampaignSendAsLoader from '../../CampaignSettingsModule/hoc/CampaignSendAsLoader';
import {
  campaignNotificationUpdate,
  campaignGeneralSetSendAsLoadRequest,
  campaignNotificationSaveRequest,
  campaignNameSaveRequest,
  campaignGiftResearchOptionsSaveRequest,
  campaignSettingsOwnerSaveRequest,
  campaignGeneralSettingsLoadRequest,
  updateCampaignPurposeRequest,
  updateCampaignSpecificTeamMembers,
} from '../../../store/campaign/general/general.actions';
import BrandingSettings from '../../BrandingSettings/BrandingSettings';
import {
  getBrandingOwner,
  getIsLoading as getIsBrandingLoading,
} from '../../../store/campaign/branding/branding.selectors';
import { loadBrandingRequest } from '../../../store/campaign/branding/branding.actions';
import { getCampaignTypeName } from '../../../../../helpers/campaignSettings.helpers';
import sparklesIcon from '../../../../../assets/images/flourishes.png';
import useConnectToSf from '../../../../../hooks/useConnectToSf';

import CampaignOwner from './CampaignOwner';
import CampaignName from './CampaignName';
import AutomaticGiftProposal from './AutomaticGiftProposal/AutomaticGiftProposal';
import CampaignSendAs from './CampaignSendAs';
import NotificationsTable from './NotificationsTable';
import CampaignPurpose from './CampaignPurpose';
import TeamSettings from './TeamSettings';

const useStyles = makeStyles(({ spacing }) => ({
  icon: {
    width: 32,
    height: 32,
    margin: spacing(-1, 1, 0, 0),
  },
}));

const GeneralSettings = ({ campaignId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const campaign = useSelector(getCampaignGeneralSettings);
  const { team_members: campaignSpecificTeamMemberIds } = campaign;
  const isLoading = useSelector(getCampaignGeneralSettingsIsLoading);
  const errors = useSelector(getCampaignGeneralSettingsError);
  const countries = useSelector(CommonData.selectors.getCommonCountries);

  const campaignCountriesNames = useMemo(
    () => countries.filter(country => campaign?.countryIds?.includes(country.id)).map(country => country.name),
    [campaign, countries],
  );

  const getCampaignProp = useCallback(prop => campaign && campaign[prop], [campaign]);

  const isBrandingLoading = useSelector(getIsBrandingLoading);
  const brandingOwner = useSelector(getBrandingOwner);

  const campaignType = useSelector(getCampaignType);
  const isStandard = useSelector(getIsStandard);

  const { handleConnectSFCampaign, isConnectToSFSectionDisplayed } = useConnectToSf(campaignId);

  const notificationsCount = useMemo(() => {
    const notifications = getCampaignProp('notifications');
    if (!notifications) {
      return 0;
    }
    const statuses = Object.keys(notifications);
    return statuses.reduce((result, status) => {
      const persons = Object.keys(notifications[status]);
      const personsToNotifyCount = persons.filter(person => notifications[status][person]).length;
      return result + personsToNotifyCount;
    }, 0);
  }, [getCampaignProp]);

  const handleToggleNotification = useCallback(
    (status, type, value) => {
      dispatch(campaignNotificationUpdate({ status, type, value }));
    },
    [dispatch],
  );

  const handleSandAsUpdate = useCallback(e => dispatch(campaignGeneralSetSendAsLoadRequest(e)), [dispatch]);

  const handleCampaignNameUpdate = useCallback(
    campaignName => dispatch(campaignNameSaveRequest({ campaignName, campaignId })),
    [dispatch, campaignId],
  );

  const handleCampaignTeamMembersUpdate = useCallback(
    teamMemberIds => {
      dispatch(
        updateCampaignSpecificTeamMembers({
          campaignId,
          teamMemberIds,
        }),
      );
    },
    [campaignId, dispatch],
  );

  const handleUpdateCampaignPurpose = useCallback(
    ({ purpose, numberOfRecipients }) =>
      dispatch(updateCampaignPurposeRequest({ purpose, numberOfRecipients, campaignId })),
    [dispatch, campaignId],
  );

  const handleCampaignOwnerUpdate = useCallback(
    ownerId => dispatch(campaignSettingsOwnerSaveRequest({ campaignId, ownerId })),
    [dispatch, campaignId],
  );
  const handleSaveNotification = useCallback(() => {
    dispatch(
      campaignNotificationSaveRequest({
        campaignId,
        notifications: getCampaignProp('notifications'),
      }),
    );
  }, [dispatch, getCampaignProp, campaignId]);

  const onSetCampaignProposalType = useCallback(
    option => {
      dispatch(campaignGiftResearchOptionsSaveRequest({ campaignId, option }));
    },
    [campaignId, dispatch],
  );

  const handleChangeStyling = useCallback(() => {
    dispatch(loadBrandingRequest({ campaignId, showBranding: true }));
  }, [campaignId, dispatch]);

  useEffect(() => {
    if (campaignId) {
      dispatch(campaignGeneralSettingsLoadRequest(campaignId));
      dispatch(loadBrandingRequest({ campaignId, showBranding: false }));
    }
  }, [dispatch, campaignId]);

  return (
    <>
      <SettingsItem
        title="Campaign Name"
        description="This campaign name is set to"
        isLoading={isLoading}
        value={getCampaignProp('name')}
      >
        <Box pt={2}>
          <CampaignName
            errors={errors}
            isLoading={isLoading}
            onSubmit={handleCampaignNameUpdate}
            campaignName={getCampaignProp('name')}
          />
        </Box>
      </SettingsItem>
      <BaseSettingsItem
        title="Campaign type"
        isLoading={isLoading}
        valueNode={
          <>
            <Box display="flex">
              This campaign type is set to:
              <Box ml={1} className="Body-Regular-Left-Chambray-Bold">
                {getCampaignTypeName(campaignType)}
              </Box>
            </Box>
            <Box display="flex">
              For recipients living in the following countries:
              <Box ml={1} className="Body-Regular-Left-Chambray-Bold">
                {campaignCountriesNames.join(', ')}
              </Box>
            </Box>
          </>
        }
      />
      <SettingsItem
        title="Campaign Purpose"
        badge="New"
        icon={<img src={sparklesIcon} className={classes.icon} alt="Campaign Purpose" />}
        description="Let us know the purpose and audience of this campaign and Alyce will crunch some wonderful numbers for you!"
        valueNode={
          <>
            {getCampaignProp('campaignPurpose') ? (
              <>
                <Box display="flex">
                  Purpose:
                  <Box ml={1} className="Body-Regular-Left-Chambray-Bold">
                    {getCampaignProp('campaignPurpose')}
                  </Box>
                </Box>
                <Box display="flex">
                  Estimated Audience-size:
                  <Box ml={1} className="Body-Regular-Left-Chambray-Bold">
                    {`${getCampaignProp('numberOfRecipients')} recipients`}
                  </Box>
                </Box>
              </>
            ) : (
              <Box className="Body-Regular-Left-Chambray-Bold">Unspecified</Box>
            )}
          </>
        }
        isLoading={isLoading}
      >
        <Box pt={2}>
          <CampaignPurpose
            isLoading={isLoading}
            onSubmit={handleUpdateCampaignPurpose}
            purpose={getCampaignProp('campaignPurpose')}
            numberOfRecipients={getCampaignProp('numberOfRecipients')}
          />
        </Box>
      </SettingsItem>
      <TeamSettings
        teamName={getCampaignProp('team_name')}
        campaignSpecificTeamMemberIds={campaignSpecificTeamMemberIds}
        isCampaignGeneralSettingsLoading={isLoading}
        onSubmit={handleCampaignTeamMembersUpdate}
      />
      <BrandingSettings
        title="Gift Redemption Page Branding"
        description="Apply custom branding to all gift redemption pages for this campaign"
        isLoading={isBrandingLoading}
        onChange={handleChangeStyling}
        brandingOwner={brandingOwner}
      />
      <SettingsItem
        title="Campaign owner"
        description={`You need to assign a campaign owner so that Alyce can send them all notifications (which include status updates and calendar bookings). ${getCampaignProp(
          'name',
        )} campaign owner is set to`}
        isLoading={isLoading}
        value={getCampaignProp('owner') && getCampaignProp('owner').full_name}
      >
        <Box pt={2}>
          <CampaignOwner
            campaignId={campaignId}
            error={errors}
            isLoading={isLoading}
            onSubmit={handleCampaignOwnerUpdate}
            campaignOwner={getCampaignProp('owner')}
          />
        </Box>
      </SettingsItem>
      {isStandard && (
        <>
          <CampaignSendAsLoader
            campaignId={campaignId}
            render={({ members, isLoading: membersLoading }) => (
              <SettingsItem
                title="Default send-as"
                description={`You can send a gift on behalf of another member of your Team. Select the member you'd like to send as and if you want all correspondence to go to them. ${getCampaignProp(
                  'name',
                )} default send-as is set to`}
                isLoading={isLoading}
                value={(getCampaignProp('send_as') && getCampaignProp('send_as').full_name) || 'none'}
              >
                <CampaignSendAs
                  campaignId={campaignId}
                  members={members}
                  isLoading={membersLoading || isLoading}
                  selectedMemberId={getCampaignProp('send_as') ? getCampaignProp('send_as').id : null}
                  isLocked={!getCampaignProp('can_override_from')}
                  onSubmit={handleSandAsUpdate}
                />
              </SettingsItem>
            )}
          />
          <SettingsItem
            title="Gift research options"
            description="Gift research is set to"
            isLoading={isLoading}
            value={giftResearchFlowTypeNames[getCampaignProp('research_flow')]}
          >
            <AutomaticGiftProposal
              value={getCampaignProp('research_flow')}
              isLoading={isLoading}
              onSubmit={onSetCampaignProposalType}
            />
          </SettingsItem>
        </>
      )}
      <SettingsItem
        title="Email notifications"
        description={`There are 4 main milestones in a gift journey: Gift Options are Ready, Gift Invitation Delivered, Gift Landing Page Viewed, Gift Accepted. Choose the appropriate email notifications for the Alyce end users. ${getCampaignProp(
          'name',
        )} currently has`}
        isLoading={isLoading}
        value={`${notificationsCount} notifications`}
      >
        <NotificationsTable
          campaignType={campaignType}
          onSave={handleSaveNotification}
          onToggle={handleToggleNotification}
          notifications={getCampaignProp('notifications')}
          owner={getCampaignProp('owner') || {}}
          sendAs={getCampaignProp('send_as') || {}}
        />
      </SettingsItem>
      {isConnectToSFSectionDisplayed && (
        <CampaignSettings.SfConnectionSettings
          title="Connect to Salesforce"
          description="Connect this Alyce campaign with a Salesforce campaign to ensure that all Alyce gifts are synchronized with your Salesforce campaign."
          onChange={handleConnectSFCampaign}
        />
      )}
    </>
  );
};

GeneralSettings.propTypes = {
  campaignId: PropTypes.number.isRequired,
};

export default memo(GeneralSettings);
