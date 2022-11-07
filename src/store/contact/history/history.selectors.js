import * as R from 'ramda';
import { updateSearch } from '@alycecom/modules';
import { pickNotEmpty, renameKeys } from '@alycecom/utils';

import { getContactState } from '../contact.selectors';
import { viewLoading } from '../../../helpers/lens.helpers';

export const getHistoryState = R.compose(R.prop('history'), getContactState);

export const getGifts = R.compose(R.prop('gifts'), getHistoryState);

export const getHistoryIsLoading = R.compose(viewLoading, getHistoryState);

const giftApiParams = R.pick(['teamId', 'campaignId', 'dateRangeFrom', 'dateRangeTo', 'memberId']);

export const getApiCallQuery = R.compose(
  R.curryN(2, updateSearch)(''),
  renameKeys({
    memberId: 'team_member_id',
    teamId: 'team_id',
    campaignId: 'campaign_id',
    dateRangeFrom: 'date_range_from',
    dateRangeTo: 'date_range_to',
  }),
  pickNotEmpty,
  giftApiParams,
);

export const buildApiUrl = ({ contactId, ...rest }) =>
  `/enterprise/contact/${contactId}/gift-history?${getApiCallQuery(rest)}`;
