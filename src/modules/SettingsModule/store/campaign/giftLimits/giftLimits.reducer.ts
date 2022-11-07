import { createReducer } from 'redux-act';

import {
  loadGiftLimitsFail,
  loadGiftLimitsRequest,
  loadGiftLimitsSuccess,
  setGiftLimits,
  toggleUserLimitSelection,
  toggleUsersLimitSelections,
  updateGiftLimitsFail,
  updateGiftLimitsRequest,
  updateGiftLimitsSuccess,
} from './giftLimits.actions';
import { IGiftLimit } from './giftLimits.types';

export interface IGiftLimitsState {
  giftLimits: IGiftLimit[];
  isLoading: boolean;
  selectedUsers: IGiftLimit[];
}

export const giftLimitsInitialState: IGiftLimitsState = {
  giftLimits: [],
  isLoading: false,
  selectedUsers: [],
};

export default createReducer({}, giftLimitsInitialState)
  .on(loadGiftLimitsRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadGiftLimitsSuccess, (state, giftLimits) => ({
    ...state,
    giftLimits,
    isLoading: false,
  }))
  .on(loadGiftLimitsFail, state => ({
    ...state,
    isLoading: false,
  }))

  .on(updateGiftLimitsRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(updateGiftLimitsSuccess, (state, giftLimits) => ({
    ...state,
    giftLimits,
    isLoading: false,
  }))
  .on(updateGiftLimitsFail, state => ({
    ...state,
    isLoading: false,
  }))

  .on(toggleUserLimitSelection, (state, { userLimit, checked }) => ({
    ...state,
    selectedUsers: checked
      ? [...state.selectedUsers, userLimit]
      : state.selectedUsers.filter(item => item.user_id !== userLimit.user_id),
  }))
  .on(toggleUsersLimitSelections, (state, { usersLimits, checked }) => ({
    ...state,
    selectedUsers: checked ? usersLimits : [],
  }))

  .on(setGiftLimits, (state, giftLimits) => ({
    ...state,
    giftLimits,
  }));
