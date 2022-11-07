import * as R from 'ramda';
import { updateSearch } from '@alycecom/modules';
import { pickNotEmpty, renameKeys } from '@alycecom/utils';

import { getBreakdownsState } from '../breakdowns.selectors';
import { createSelectors } from '../../../helpers/breakdownSelectors.helpers';

export const contactsApiParams = R.pick(['dateRangeFrom', 'dateRangeTo', 'sort', 'sortDirection', 'search']);

export const [
  getContactsState,
  getContactsBreakdown,
  getContactsIsLoading,
  getContactsReportIsLoading,
  getContactsIsLoaded,
] = createSelectors(getBreakdownsState)('contacts');

export const getApiCallQuery = R.compose(
  R.curryN(2, updateSearch)(''),
  renameKeys({
    sort: 'sort_column',
    sortDirection: 'sort_direction',
    search: 'search',
    dateRangeFrom: 'date_range_from',
    dateRangeTo: 'date_range_to',
  }),
  pickNotEmpty,
  contactsApiParams,
);

export const buildApiUrl = options => `/enterprise/dashboard/breakdown/recipients?${getApiCallQuery(options)}`;
export const buildReportUrl = options => `/enterprise/report/recipient_breakdown?${getApiCallQuery(options)}`;

export const getReportFileName = apiParams => () => {
  let date = '';

  if (apiParams.dateRangeFrom) {
    date = `-${apiParams.dateRangeFrom}`;
  }

  if (apiParams.dateRangeTo) {
    date += `-${apiParams.dateRangeTo}`;
  }

  return R.replace(/\./g, '_', `Contact breakdown${date || ''}`).concat('.xlsx');
};
