import React, { useCallback, useMemo, useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { CommonData, User } from '@alycecom/modules';
import { useGetTeamMembersQuery } from '@alycecom/services';

import CreateCampaign from '../../CampaignSettings/CreateCampaign/CreateCampaign';
import { getIsLoaded, getTeams } from '../../../../../store/teams/teams.selectors';
import { createCampaignRequest, resetErrors } from '../../../store/campaign/createCampaign/createCampaign.actions';
import { getErrors, getIsInProgress } from '../../../store/campaign/createCampaign/createCampaign.selectors';
import { loadManagersRequest } from '../../../store/teams/managers/managers.actions';
import { getManagers } from '../../../store/teams/managers/managers.selectors';
import { getNumberOfRecipientsOptions, getPurposesOptions } from '../../../store/campaign/purposes/purposes.selectors';
import { loadPurposesRequest } from '../../../store/campaign/purposes/purposes.actions';

const SettingsCreateCampaign = ({ parentUrl }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const createIsInProgress = useSelector(getIsInProgress);
  const errors = useSelector(getErrors);
  const managers = useSelector(getManagers);
  const user = useSelector(User.selectors.getUser);

  const [campaignName, setCampaignName] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [team, setTeam] = useState('');
  const [teamOwner, setTeamOwner] = useState('');
  const [purpose, setPurpose] = useState('');
  const [numberOfRecipients, setNumberOfRecipients] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [campaignSpecificTeamMembers, setCampaignSpecificTeamMembers] = useState([]);

  useEffect(() => {
    setTeamOwner(user.id);
  }, [user]);

  const teamOwnerName = useMemo(() => {
    if (managers && teamOwner) {
      const teamMemberElement = managers.find(teamMemberItem => teamMemberItem.id === teamOwner);
      if (teamMemberElement) {
        return teamMemberElement.name;
      }
    }

    return '';
  }, [teamOwner, managers]);

  const onUpdateTeam = useCallback(
    ({ teamId }) => {
      setTeam(teamId);
      setCampaignSpecificTeamMembers([]);
      dispatch(loadManagersRequest(teamId));
    },
    [dispatch],
  );

  const onUpdateTeamOwner = useCallback(({ teamOwnerId }) => {
    setTeamOwner(teamOwnerId);
  }, []);

  const teams = useSelector(getTeams);
  const isTeamsLoaded = useSelector(getIsLoaded);
  const managedTeams = useSelector(User.selectors.getUserCanManageTeams);
  const countries = useSelector(CommonData.selectors.getCommonAvailableCountries);
  const purposesOptions = useSelector(getPurposesOptions);
  const numberOfRecipientsOptions = useSelector(getNumberOfRecipientsOptions);

  const { data, isLoading } = useGetTeamMembersQuery({ teamId: team });

  useEffect(() => {
    if (!isLoading) {
      setTeamMembers(Object.values(data.entities));
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (isTeamsLoaded && teams.length === 0) {
      history.push('/');
    }
  }, [teams, isTeamsLoaded, history]);

  useEffect(() => {
    if (countries.length > 0) {
      setSelectedCountries(
        countries.filter(({ id }) => id === CommonData.COUNTRIES.US.id || id === CommonData.COUNTRIES.CA.id),
      );
    }
  }, [countries]);

  const enterpriseTeams = useMemo(() => {
    const result = teams.filter(
      teamItem => !!teamItem.settings.enterprise_mode_enabled && (managedTeams || []).includes(teamItem.id),
    );
    if (result.length) {
      onUpdateTeam({ teamId: result[0].id });
    }
    return result;
  }, [teams, managedTeams, onUpdateTeam]);

  const teamName = useMemo(() => {
    if (enterpriseTeams && team) {
      const teamElement = enterpriseTeams.find(teamItem => teamItem.id === team);
      if (teamElement) {
        return teamElement.name;
      }
    }

    return '';
  }, [team, enterpriseTeams]);

  const handleCreateCampaign = useCallback(() => {
    dispatch(
      createCampaignRequest({
        team,
        teamOwner,
        campaignName,
        teamMemberIds: campaignSpecificTeamMembers.map(member => member.id),
        countryIds: selectedCountries.map(country => country.id),
        purpose,
        numberOfRecipients,
      }),
    );
  }, [
    team,
    teamOwner,
    campaignName,
    dispatch,
    selectedCountries,
    purpose,
    numberOfRecipients,
    campaignSpecificTeamMembers,
  ]);

  useEffect(() => {
    dispatch(loadPurposesRequest());
  }, [dispatch]);

  useEffect(() => () => dispatch(resetErrors()), [dispatch]);

  return (
    <CreateCampaign
      teamList={enterpriseTeams}
      team={team}
      teamName={teamName}
      setTeam={onUpdateTeam}
      teamAdmins={managers}
      teamMembers={teamMembers}
      campaignSpecificTeamMembers={campaignSpecificTeamMembers}
      setCampaignSpecificTeamMembers={setCampaignSpecificTeamMembers}
      teamOwner={teamOwner}
      teamOwnerName={teamOwnerName}
      setTeamOwner={onUpdateTeamOwner}
      campaignName={campaignName}
      setCampaignName={setCampaignName}
      isLoading={createIsInProgress}
      onCreate={handleCreateCampaign}
      parentUrl={parentUrl}
      errors={errors}
      selectedCountries={selectedCountries}
      setSelectedCountries={setSelectedCountries}
      countries={countries}
      purpose={purpose}
      purposesOptions={purposesOptions}
      onChangePurpose={setPurpose}
      numberOfRecipients={numberOfRecipients}
      numberOfRecipientsOptions={numberOfRecipientsOptions}
      onChangeNumberOfRecipients={setNumberOfRecipients}
    />
  );
};

SettingsCreateCampaign.propTypes = {
  parentUrl: PropTypes.string.isRequired,
};

export default memo(SettingsCreateCampaign);
