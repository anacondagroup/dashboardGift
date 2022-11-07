import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsItem, User } from '@alycecom/modules';
import PropTypes from 'prop-types';
import { useRouting } from '@alycecom/hooks';

import { actions, selectors } from '../../../../store/teams/generalSettings';
import TeamNameForm from '../Forms/TeamNameForm';
import UnsubscribeLinkForm from '../Forms/UnsubscribeLinkForm';
import RequireEmailIntegrationForm from '../Forms/RequireEmailIntegrationForm';
import NameUsageInEmailsForm from '../Forms/NameUsageInEmailsForm';
import BlockRemindersForm from '../Forms/BlockRemindersForm';
import { loadBrandingRequest } from '../../../../store/teams/branding/branding.actions';
import {
  getBrandingOwner,
  getIsLoading as getIsBrandingLoading,
} from '../../../../store/teams/branding/branding.selectors';
import BrandingSettings from '../../../BrandingSettings/BrandingSettings';
import { loadEmailBrandingRequest } from '../../../../store/teams/emailBranding/emailBranding.actions';
import {
  getHasEmailBranding,
  getIsLoading as getIsEmailBrandingLoading,
} from '../../../../store/teams/emailBranding/emailBranding.selectors';

const GeneralSettings = ({ teamId }) => {
  const dispatch = useDispatch();
  const go = useRouting();
  const isLoading = useSelector(selectors.getIsLoading);
  const teamName = useSelector(selectors.getTeamName);
  const unsubscribeUrl = useSelector(selectors.getOuterUnsubscribeUrl);
  const requireEmailIntegration = useSelector(selectors.getRequireEmailIntegration);
  const nameUsageInEmails = useSelector(selectors.getNameUsageInEmails);
  const isBlockReminders = useSelector(selectors.getIsBlockReminders);
  const isUsingDKIM = useSelector(User.selectors.getIsUsingDKIM);
  const integrationScope = isUsingDKIM ? 'calendar' : 'calendar and email';

  const isBrandingLoading = useSelector(getIsBrandingLoading);
  const brandingOwner = useSelector(getBrandingOwner);

  const isEmailBrandingLoading = useSelector(getIsEmailBrandingLoading);
  const hasEmailBranding = useSelector(getHasEmailBranding);

  const nameInEmailSettingValue =
    {
      name: 'Sender name',
      name_and_company: 'Sender name and Company',
    }[nameUsageInEmails] || 'Disabled';
  const blockReminderSettingValue = ['Send reminder emails to recipients', 'Do not send reminder emails to recipients'][
    Number(isBlockReminders)
  ];
  const emailIntegrationSettingValue = {
    show: 'Prompt only',
    required: 'Restrict',
    not_show: 'Never prompt',
  }[requireEmailIntegration];

  const handleSubmit = useCallback(
    changes => {
      dispatch(actions.updateSettings({ ...changes, teamId }));
    },
    [dispatch, teamId],
  );

  const handleChangeBranding = useCallback(() => {
    dispatch(loadBrandingRequest({ teamId, showBranding: true }));
  }, [dispatch, teamId]);

  const handleChangeEmailBranding = useCallback(() => {
    go(`/branding/teams/${teamId}`);
  }, [teamId, go]);

  useEffect(() => {
    dispatch(actions.getSettings(teamId));
  }, [dispatch, teamId]);

  useEffect(() => {
    if (teamId) {
      dispatch(loadBrandingRequest({ teamId }));
      dispatch(loadEmailBrandingRequest({ teamId }));
    }
  }, [dispatch, teamId]);

  return (
    <>
      <SettingsItem
        title="Team Name"
        description="This team name is currently set to"
        isLoading={isLoading}
        value={teamName}
      >
        <TeamNameForm onSubmit={handleSubmit} />
      </SettingsItem>
      <BrandingSettings
        title="Gift Redemption Page Branding"
        description="Apply custom branding to all gift redemption pages for your team (unless otherwise customized for a given campaign)"
        isLoading={isBrandingLoading}
        brandingOwner={brandingOwner}
        onChange={handleChangeBranding}
      />
      <BrandingSettings
        title="Email Custom Branding"
        description="Apply custom branding to all gift invitation emails sent from members of this team. (Note that if members of your team have set up email integration to send invitations from their email accounts, this custom branding will only be applied to follow-up emails sent from Alyce.)"
        isLoading={isEmailBrandingLoading}
        brandingOwner={hasEmailBranding ? 'Team' : ''}
        onChange={handleChangeEmailBranding}
      />
      <SettingsItem
        title="Unsubscribe link"
        description="As recipient receive gifts, they may want to unsubscribe from your companies emails. The link that the recipient will be taken to is currently"
        isLoading={isLoading}
        value={unsubscribeUrl || 'none'}
      >
        <UnsubscribeLinkForm onSubmit={handleSubmit} />
      </SettingsItem>
      <SettingsItem
        title={`Require ${integrationScope} integration`}
        description={`You can prompt a team member to connect their ${integrationScope} within the gifting flow if they have not yet integrated their email with Alyce. ${teamName} is currently set to`}
        value={emailIntegrationSettingValue}
        isLoading={isLoading}
        collapsible
      >
        <RequireEmailIntegrationForm onSubmit={handleSubmit} />
      </SettingsItem>
      <SettingsItem
        title="Follow up preference"
        description={`Alyce has the ability to follow up with your recipients to remind them to claim their gifts. ${teamName} team default is currently set to`}
        isLoading={isLoading}
        value={blockReminderSettingValue}
      >
        <BlockRemindersForm onSubmit={handleSubmit} />
      </SettingsItem>
      <SettingsItem
        title="Personal From field in Alyce emails"
        description="If your team members have not integrated their email service, you can enable a personal From field in the Alyce emails"
        isLoading={isLoading}
        value={nameInEmailSettingValue}
      >
        <NameUsageInEmailsForm onSubmit={handleSubmit} />
      </SettingsItem>
    </>
  );
};

GeneralSettings.propTypes = {
  teamId: PropTypes.number.isRequired,
};

export default GeneralSettings;
