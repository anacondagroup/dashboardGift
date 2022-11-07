import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsItem } from '@alycecom/modules';
import { Box } from '@mui/material';

import { teamGiftInvitesSettingRequest } from '../../../../store/teams/giftInvites/marketplaceRestrictions/marketplaceRestrictions.actions';
import { getMarketplaceRestrictionsSettings } from '../../../../store/teams/giftInvites/marketplaceRestrictions/marketplaceRestrictions.selectors';
import useTeamInvitationMethods from '../../../../hooks/useTeamInvitationMethods';
import { actions, selectors } from '../../../../store/teams/generalSettings';

import GiftInvitationMethodsTable from './GiftInvites/GiftInvitationMethodsTable';
import TeamSettingsGiftVendors from './TeamSettingsGiftVendors/TeamSettingsGiftVendors';
import TeamSettingsGiftTypes from './TeamSettingsGiftTypes/TeamSettingsGiftTypes';
import ComplianceSetting from './ComplianceSetting/ComplianceSetting';

const TeamSettingsGiftInvitesComponent = ({ teamId, teamName }) => {
  const [
    invitationMethods,
    invitationMethodsNames,
    invitationMethodsIsLoading,
    setRestrictedInvitationTypes,
  ] = useTeamInvitationMethods(teamId);
  const isComplianceRequired = useSelector(selectors.getIsComplianceRequired);

  const settings = useSelector(getMarketplaceRestrictionsSettings);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(teamGiftInvitesSettingRequest(teamId));
    dispatch(actions.getSettings(teamId));
  }, [dispatch, teamId]);

  return (
    <>
      <SettingsItem
        title="Inventory and availability"
        description={`Keep track of how many delivery methods are in your inventory and decide which delivery methods are available to your team. ${teamName} currently has access to`}
        isLoading={false}
        value={invitationMethodsNames}
      >
        <GiftInvitationMethodsTable
          isLoading={invitationMethodsIsLoading}
          methods={invitationMethods}
          onSubmit={setRestrictedInvitationTypes}
        />
      </SettingsItem>
      <SettingsItem
        title="Gift types"
        description={`Set which gift types are allowed to be viewed and selected inside of the marketplace as well as Alyce gift suggestions (IE Gift cards, Physical Gifts, Subscriptions, etc). ${teamName} defaults are currently set to`}
        isLoading={settings.isLoading}
        value={`${settings.restrictedTypesAmount || 'No'} restricted types`}
      >
        <TeamSettingsGiftTypes teamId={teamId} />
      </SettingsItem>
      <SettingsItem
        title="Gift vendors"
        description={`Set which gift vendors are allowed to be viewed and selected inside of the marketplace as well as Alyce gift suggestions (IE the brands who create or supply the gift). ${teamName} defaults are currently set to`}
        isLoading={settings.isLoading}
        value={`${settings.restrictedVendorsAmount || 'No'} restricted vendors`}
      >
        <TeamSettingsGiftVendors teamId={teamId} />
      </SettingsItem>
      <SettingsItem
        title="Compliance"
        description={
          <>
            <Box>Ask your team members before they send their gifts if they’ve gotten approval to do so.</Box>
            {teamName} compliance is currently set to
          </>
        }
        isLoading={false}
        value={`${['No, do not', 'Yes,'][Number(isComplianceRequired)]} ask team members`}
      >
        <ComplianceSetting teamId={teamId} />
      </SettingsItem>
    </>
  );
};

TeamSettingsGiftInvitesComponent.propTypes = {
  teamId: PropTypes.number.isRequired,
  teamName: PropTypes.string,
};

TeamSettingsGiftInvitesComponent.defaultProps = {
  teamName: '',
};

export default TeamSettingsGiftInvitesComponent;
