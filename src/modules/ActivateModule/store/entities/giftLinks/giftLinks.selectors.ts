import { converge, equals, pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { giftLinksAdapter, TGiftLinksState } from './giftLinks.reducer';
import { GIFT_LINKS_PER_PAGE } from './giftLinks.constants';

const getGiftLinksState = (state: IRootState): TGiftLinksState => state.activate.entities.giftLinks;
const selectors = giftLinksAdapter.getSelectors(getGiftLinksState);

export const getGiftLinksStatus = pipe(getGiftLinksState, state => state.status);
export const getIsGiftLinksPending = pipe(getGiftLinksStatus, equals(StateStatus.Pending));
export const getIsGiftLinksFulfilled = pipe(getGiftLinksStatus, equals(StateStatus.Fulfilled));
export const getIsGiftLinksRejected = pipe(getGiftLinksStatus, equals(StateStatus.Rejected));

export const getGiftLinksExportStatus = pipe(getGiftLinksState, state => state.exportStatus);
export const getIsExportGiftLinksPending = pipe(getGiftLinksExportStatus, equals(StateStatus.Pending));

export const getGiftLinksMap = selectors.getEntities;
export const getGiftLinks = selectors.getAll;
export const getGiftLinkIds = selectors.getIds;
export const getGiftLinksLoadedTotal = selectors.getTotal;
export const getGiftLinksTotal = pipe(getGiftLinksState, state => state.total);
export const getGiftLinksCampaignId = pipe(getGiftLinksState, state => state.campaignId);

export const getGiftLinksFilter = pipe(getGiftLinksState, state => state.filter);
export const getSearchFilter = pipe(getGiftLinksState, state => state.filter.search);
export const getSortFilter = pipe(getGiftLinksState, state => state.filter.sort);
export const getPaginationFilter = pipe(getGiftLinksState, state => state.filter.pagination);

export const getIsCanLoadMore = converge(
  (isPending: boolean, loadedTotal: number, total: number) => !isPending && loadedTotal < total,
  [getIsGiftLinksPending, getGiftLinksLoadedTotal, getGiftLinksTotal],
);

export const getGiftLinksTotalWithLoading = converge(
  (isPending, loadedTotal, canLoadMore) => (isPending || canLoadMore ? loadedTotal + GIFT_LINKS_PER_PAGE : loadedTotal),
  [getIsGiftLinksPending, getGiftLinksLoadedTotal, getIsCanLoadMore],
);
