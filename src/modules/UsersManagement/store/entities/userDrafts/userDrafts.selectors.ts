import { createSelector } from 'reselect';

import { IRootState } from '../../../../../store/root.types';

import { userDraftsAdapter, TUserDraftsState } from './userDrafts.reducer';

const getUserDraftsState = (state: IRootState): TUserDraftsState => state.usersManagement.entities.userDrafts;

const selectors = userDraftsAdapter.getSelectors(getUserDraftsState);

export const getUserDrafts = selectors.getAll;
export const getUserDraftsMap = selectors.getEntities;
export const getUserDraftIds = selectors.getIds;

export const getUserDraftsCount = createSelector(getUserDraftIds, ids => ids.length);

export const getFirstUserDraft = createSelector(getUserDrafts, usersDrafts =>
  usersDrafts.length > 0 ? usersDrafts[0] : null,
);

export const getHasUserDraftsWithErrors = createSelector(getUserDrafts, usersDrafts =>
  usersDrafts.some(draft => draft.hasTeam || draft.isDuplicated || !draft.isWhitelistedDomain),
);
