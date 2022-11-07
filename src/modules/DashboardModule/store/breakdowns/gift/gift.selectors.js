import * as R from 'ramda';

import { getBreakdownsState } from '../breakdowns.selectors';
import { makeGetTeamById } from '../../../../../store/teams/teams.selectors';
import { makeGetMemberById } from '../../members/members.selectors';
import { createSelectors } from '../../../helpers/breakdownSelectors.helpers';
import { makeGetCampaignById } from '../../../../../store/campaigns/campaigns.selectors';

export const [
  getGiftState,
  getGiftBreakdown,
  getGiftIsLoading,
  getGiftReportIsLoading,
  getGiftIsLoaded,
  getGiftPagination,
] = createSelectors(getBreakdownsState)('gift');

export const getReportFileName = apiParams => state => {
  let team = null;
  let date = '';
  let member = null;
  let campaign = null;

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

  if (apiParams.campaignId) {
    const { name: campaignName } = makeGetCampaignById(apiParams.campaignId)(state);
    campaign = `-${campaignName}-Campaign`;
  }

  return R.replace(/\./g, '_', `Gifts breakdown${team || ''}${campaign || ''}${member || ''}${date || ''}`).concat(
    '.xlsx',
  );
};

export const searchGifts = (search = '') =>
  R.filter(
    R.compose(
      R.any(value => value.toString().toLowerCase().includes(search.toString().toLowerCase())),
      R.values,
    ),
  );

export const getSortBy = R.cond([
  [R.equals('name'), R.always(R.compose(R.toLower, item => `${item.firstName} ${item.lastName}`))],
  [R.equals('giftStatus'), R.always(R.prop('giftStatusId'))],
  [R.equals('sentOn'), R.always(R.compose(sentOn => (sentOn ? new Date(sentOn).getTime() : 0), R.prop('sentOn')))],
  [R.T, field => R.compose(R.toLower, R.prop(field))],
]);

export const sortGifts = (order, orderBy) =>
  R.compose(orderBy === 'asc' ? R.identity : R.reverse, R.sortBy(getSortBy(order)));
