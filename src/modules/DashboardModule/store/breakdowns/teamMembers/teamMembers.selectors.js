import * as R from 'ramda';
import { updateSearch } from '@alycecom/modules';
import { pickNotEmpty, renameKeys } from '@alycecom/utils';

import { getBreakdownsState } from '../breakdowns.selectors';
import { makeGetTeamById } from '../../../../../store/teams/teams.selectors';
import { makeGetCampaignById } from '../../../../../store/campaigns/campaigns.selectors';
import { createSelectors } from '../../../helpers/breakdownSelectors.helpers';

const teamMembersApiParams = R.pick([
  'teamId',
  'dateRangeFrom',
  'dateRangeTo',
  'sort',
  'sortDirection',
  'search',
  'campaignId',
]);

export const [
  getTeamMembersState,
  getTeamMembersBreakdown,
  getTeamMembersIsLoading,
  getTeamMembersReportIsLoading,
  getTeamMembersIsLoaded,
] = createSelectors(getBreakdownsState)('teamMembers');

export const getApiCallQuery = R.compose(
  R.curryN(2, updateSearch)(''),
  renameKeys({
    teamId: 'team_id',
    campaignId: 'campaign_id',
    sort: 'sort_column',
    sortDirection: 'sort_direction',
    search: 'search',
    dateRangeFrom: 'date_range_from',
    dateRangeTo: 'date_range_to',
  }),
  pickNotEmpty,
  teamMembersApiParams,
);

export const getReportFileName = apiParams => state => {
  let team = null;
  let date = '';
  let campaign = null;

  if (apiParams.teamId) {
    const { name: teamName } = makeGetTeamById(apiParams.teamId)(state);
    team = `-${teamName}-Team`;
  }

  if (apiParams.campaignId) {
    const { name: campaignName } = makeGetCampaignById(apiParams.campaignId)(state);
    campaign = `-${campaignName}-Moment`;
  }

  if (apiParams.dateRangeFrom) {
    date = `-${apiParams.dateRangeFrom}`;
  }

  if (apiParams.dateRangeTo) {
    date += `-${apiParams.dateRangeTo}`;
  }

  return R.replace(/\./g, '_', `Team members breakdown${team || ''}${campaign || ''}${date || ''}`).concat('.xlsx');
};

export const buildApiUrl = ({ teamId, ...rest }) =>
  `/enterprise/dashboard/breakdown/teams/${teamId}/members?${getApiCallQuery(rest)}`;

export const buildReportUrl = params => `/enterprise/report/team_breakdown?${getApiCallQuery(params)}`;
