import * as R from 'ramda';
import { createSelector } from 'reselect';
import { updateSearch } from '@alycecom/modules';
import { pickNotEmpty, renameKeys } from '@alycecom/utils';

import { makeGetTeamById } from '../../../../store/teams/teams.selectors';
import { makeGetMemberById } from '../members/members.selectors';
import { makeGetCampaignById } from '../../../../store/campaigns/campaigns.selectors';
import { createSelectors } from '../../helpers/breakdownSelectors.helpers';

const convertObjectToUrlSearch = R.curryN(2, updateSearch)('');
export const overviewApiParams = R.pick(['campaignId', 'teamId', 'dateRangeFrom', 'dateRangeTo', 'memberId']);

export const [, , , getOverviewReportIsLoading] = createSelectors(R.prop('dashboard'))('overview');

export const getApiCallQuery = R.compose(
  convertObjectToUrlSearch,
  renameKeys({
    memberId: 'team_member_id',
    campaignId: 'campaign_id',
    teamId: 'team_id',
    dateRangeFrom: 'date_range_from',
    dateRangeTo: 'date_range_to',
  }),
  pickNotEmpty,
  overviewApiParams,
);

export const getReportFileName = apiParams => state => {
  let team = null;
  let dateFrom = null;
  let dateTo = null;
  let member = null;
  let campaign = null;

  if (apiParams.teamId) {
    const { name: teamName } = makeGetTeamById(apiParams.teamId)(state);
    team = `-${teamName}-Team`;
  }

  if (apiParams.dateRangeFrom) {
    dateFrom = `-${apiParams.dateRangeFrom}`;
  }
  if (apiParams.dateRangeTo) {
    dateTo = `-${apiParams.dateRangeTo}`;
  }

  if (apiParams.campaignId) {
    const { name: campaignName } = makeGetCampaignById(apiParams.campaignId)(state);
    campaign = `-${campaignName}-Campaign`;
  }

  if (apiParams.memberId) {
    const { fullName: memberName } = makeGetMemberById(apiParams.memberId)(state);
    member = `-${memberName}`;
  }

  return `Current-gift-statuses${member || ''}${campaign || ''}${team || ''}${dateFrom || ''}${
    dateTo ? `-${dateTo}` : ''
  }.xlsx`;
};

export const overviewSelector = createSelector(
  state => state.dashboard.overview,
  overview => ({
    kpi: overview.kpi,
    statuses: overview.statuses,
    isLoading: overview.isLoading,
    total: R.compose(
      R.sum,
      R.filter(val => typeof val === 'number'),
      R.values,
    )(overview.statuses),
  }),
);
