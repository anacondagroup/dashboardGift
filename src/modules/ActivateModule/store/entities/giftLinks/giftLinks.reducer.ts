import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import { TGiftLink, TGiftLinkFilter } from './giftLinks.types';
import {
  downloadGiftLinks,
  downloadGiftLinksFail,
  downloadGiftLinksSuccess,
  fetchGiftLinks,
  fetchGiftLinksFail,
  fetchGiftLinksSuccess,
  resetGiftLinks,
  setSearchFilter,
  setSortFilter,
} from './giftLinks.actions';
import { GIFT_LINKS_PER_PAGE } from './giftLinks.constants';

export const giftLinksAdapter = createEntityAdapter<TGiftLink>({
  getId: entity => entity.userId,
});

export const initialState = giftLinksAdapter.getInitialState({
  status: StateStatus.Idle,
  exportStatus: StateStatus.Idle,
  total: NaN,
  campaignId: NaN,
  filter: {
    pagination: {
      offset: 0,
      limit: GIFT_LINKS_PER_PAGE,
    },
  } as TGiftLinkFilter,
});

export type TGiftLinksState = typeof initialState;

export const giftLinks = createReducer<TGiftLinksState>({}, initialState);

giftLinks.on(fetchGiftLinks, (state, payload) => ({
  ...state,
  campaignId: payload.campaignId,
  filter: {
    ...(payload.campaignId === state.campaignId ? state.filter : initialState.filter),
  },
  status: StateStatus.Pending,
}));

giftLinks.on(fetchGiftLinksSuccess, (state, payload) => ({
  ...state,
  ...giftLinksAdapter.upsertMany(payload.data, state),
  total: payload.pagination.total,
  status: StateStatus.Fulfilled,
  filter: {
    ...state.filter,
    pagination: {
      ...state.filter.pagination,
      offset: (state.filter.pagination?.offset ?? 0) + payload.data.length,
    },
  },
}));

giftLinks.on(fetchGiftLinksFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

giftLinks.on(setSearchFilter, (state, payload) => ({
  ...state,
  ...giftLinksAdapter.removeAll(state),
  filter: {
    ...state.filter,
    search: payload,
    pagination: initialState.filter.pagination,
  },
}));

giftLinks.on(setSortFilter, (state, payload) => ({
  ...state,
  ...giftLinksAdapter.removeAll(state),
  filter: {
    ...state.filter,
    sort: payload,
    pagination: initialState.filter.pagination,
  },
}));

giftLinks.on(resetGiftLinks, () => initialState);

giftLinks.on(downloadGiftLinks, state => ({
  ...state,
  exportStatus: StateStatus.Pending,
}));
giftLinks.on(downloadGiftLinksSuccess, state => ({
  ...state,
  exportStatus: StateStatus.Fulfilled,
}));
giftLinks.on(downloadGiftLinksFail, state => ({
  ...state,
  exportStatus: StateStatus.Rejected,
}));
