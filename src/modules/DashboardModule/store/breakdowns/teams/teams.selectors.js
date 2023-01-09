import * as R from 'ramda';
import { getUrlParams, updateSearch } from '@alycecom/modules';
import { renameKeys } from '@alycecom/utils';

import { getBreakdownsState } from '../breakdowns.selectors';
import { createSelectors } from '../../../helpers/breakdownSelectors.helpers';

const teamsApiParams = R.pick([
  'campaignId',
  'dateRangeFrom',
  'dateRangeTo',
  'teamsSearch',
  'teamsSort',
  'teamsDirection',
  'includeArchived',
]);

export const [
  getTeamsState,
  getTeamsBreakdown,
  getTeamsIsLoading,
  getTeamsReportIsLoading,
  getTeamsIsLoaded,
] = createSelectors(getBreakdownsState)('teams');

export const getApiCallQuery = R.compose(
  R.curryN(2, updateSearch)(''),
  renameKeys({
    campaignId: 'campaign_id',
    teamsSort: 'sort_column',
    teamsDirection: 'sort_direction',
    dateRangeFrom: 'date_range_from',
    dateRangeTo: 'date_range_to',
    teamsSearch: 'search',
    includeArchived: 'include_archived',
  }),
  teamsApiParams,
  getUrlParams,
);

export const getReportFileName = state => {
  let date = '';

  const urlParams = R.compose(teamsApiParams, getUrlParams)(state.router.location.search);

  if (urlParams.dateRangeFrom) {
    date = `-${urlParams.dateRangeFrom}`;
  }
  if (urlParams.dateRangeTo) {
    date += `-${urlParams.dateRangeTo}`;
  }

  return R.replace(/\./g, '_', `Teams-breakdown${date || ''}`).concat('.xlsx');
};
