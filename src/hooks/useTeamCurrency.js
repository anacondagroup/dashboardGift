import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { makeGetTeamIdByCampaignId } from '../store/campaigns/campaigns.selectors';
import { makeGetCurrencyByTeamId } from '../store/teams/teams.selectors';

const useTeamCurrency = campaignId => {
  const teamId = useSelector(useMemo(() => makeGetTeamIdByCampaignId(campaignId), [campaignId]));
  return useSelector(useMemo(() => makeGetCurrencyByTeamId(teamId), [teamId]));
};

export default useTeamCurrency;
