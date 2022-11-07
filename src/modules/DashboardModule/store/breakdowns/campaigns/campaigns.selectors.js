import * as R from 'ramda';
import { updateSearch } from '@alycecom/modules';
import { pickNotEmpty, renameKeys } from '@alycecom/utils';

import { getBreakdownsState } from '../breakdowns.selectors';
import { makeGetTeamById } from '../../../../../store/teams/teams.selectors';
import { makeGetMemberById } from '../../members/members.selectors';
import { createSelectors } from '../../../helpers/breakdownSelectors.helpers';

const campaignsApiParams = R.pick(['dateRangeFrom', 'dateRangeTo', 'sort', 'sortDirection', 'search', 'teamId']);

export const [
  getCampaignsState,
  getCampaignsBreakdown,
  getCampaignsIsLoading,
  getCampaignsReportIsLoading,
  getCampaignsIsLoaded,
] = createSelectors(getBreakdownsState)('campaigns');

export const getApiCallQuery = R.compose(
  R.curryN(2, updateSearch)(''),
  renameKeys({
    teamId: 'team_id',
    sort: 'sort_column',
    sortDirection: 'sort_direction',
    search: 'search',
    dateRangeFrom: 'date_range_from',
    dateRangeTo: 'date_range_to',
  }),
  pickNotEmpty,
  campaignsApiParams,
);

export const getReportFileName = apiParams => state => {
  let team = null;
  let date = '';
  let member = null;

  if (apiParams.memberId) {
    const { fullName: memberName } = makeGetMemberById(apiParams.memberId)(state);
    member = `-${memberName}`;
  }

  if (apiParams.teamId) {
    const { name: teamName } = makeGetTeamById(apiParams.teamId)(state);
    team = `-${teamName}-Team`;
  }

  if (apiParams.dateRangeFrom) {
    date = `-${apiParams.dateRangeFrom}`;
  }

  if (apiParams.dateRangeTo) {
    date += `-${apiParams.dateRangeTo}`;
  }

  return R.replace(/\./g, '_', `Campaigns breakdown${team || ''}${member || ''}${date || ''}`).concat('.xlsx');
};

export const buildApiUrl = ({ teamId, memberId, ...rest }) => {
  if (teamId && memberId) {
    return `/enterprise/dashboard/breakdown/teams/${teamId}/members/${memberId}/campaigns?${getApiCallQuery(rest)}`;
  }

  if (teamId && !memberId) {
    return `/enterprise/dashboard/breakdown/teams/${teamId}/campaigns?${getApiCallQuery(rest)}`;
  }

  return `/enterprise/dashboard/breakdown/campaigns?${getApiCallQuery(rest)}`;
};

export const buildReportUrl = ({ teamId, memberId, ...rest }) => {
  if (teamId && !memberId) {
    return `/enterprise/report/teams/${teamId}/campaign_breakdown?${getApiCallQuery(rest)}`;
  }

  if (teamId && memberId) {
    return `/enterprise/report/teams/${teamId}/members/${memberId}/campaign_breakdown?${getApiCallQuery(rest)}`;
  }

  return `/enterprise/report/campaign_breakdown?${getApiCallQuery(rest)}`;
};
