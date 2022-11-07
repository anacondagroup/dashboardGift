import * as R from 'ramda';
import { updateSearch } from '@alycecom/modules';
import { pickNotEmpty, renameKeys } from '@alycecom/utils';

const giftApiParams = R.pick([
  'teamId',
  'campaignId',
  'dateRangeFrom',
  'dateRangeTo',
  'memberId',
  'sort',
  'sortDirection',
  'search',
  'page',
]);

export const getApiCallQuery = R.compose(
  R.curryN(2, updateSearch)(''),
  renameKeys({
    memberId: 'team_member_id',
    teamId: 'team_id',
    campaignId: 'campaign_id',
    dateRangeFrom: 'date_range_from',
    dateRangeTo: 'date_range_to',
    sortDirection: 'sort_direction',
  }),
  R.evolve({
    sort: R.cond([
      [R.equals('name'), R.always('recipient_full_name')],
      [R.equals('company'), R.always('recipient_company')],
      [R.equals('gift'), R.always('product')],
      [R.equals('campaign'), R.always('campaign')],
      [R.equals('sentBy'), R.always('sent_as')],
      [R.equals('method'), R.always('gift_invitation_type')],
      [R.equals('sentOn'), R.always('sent_on')],
      [R.equals('giftStatus'), R.always('status')],
      [R.T, R.identity],
    ]),
  }),
  params => ({
    ...params,
    page: params.page || 1,
    per_page: 10,
    sort: params.sort || 'created_at',
    sortDirection: params.sortDirection || 'desc',
  }),
  pickNotEmpty,
  giftApiParams,
);

export const urlBuilder = R.compose(
  R.curryN(2, updateSearch)(''),
  renameKeys({
    memberId: 'team_member_id',
    teamId: 'team_id',
    campaignId: 'campaign_id',
    dateRangeFrom: 'date_range_from',
    dateRangeTo: 'date_range_to',
    sortDirection: 'sort_direction',
  }),
  pickNotEmpty,
);

export const getMarketoBaseUrl = () => process.env.REACT_APP_MARKETO_API_HOST || window.APP_CONFIG.marketoApiHost;
