import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { loadActivateSuccess } from '../../../activate.actions';

import {
  updateGiftingOnTheFlyFail,
  updateGiftingOnTheFlyRequest,
  updateGiftingOnTheFlySuccess,
} from './giftingOnTheFly.actions';

export interface IGiftingOnTheFlyState {
  status: StateStatus;
  data: {
    isEnabled: boolean;
  };
}

export const initialGiftingOnTheFlyState: IGiftingOnTheFlyState = {
  status: StateStatus.Idle,
  data: {
    isEnabled: false,
  },
};

export const giftingOnTheFly = createReducer({}, initialGiftingOnTheFlyState);

giftingOnTheFly.on(loadActivateSuccess, (state, { isGiftingOnTheFly }) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: {
    isEnabled: isGiftingOnTheFly,
  },
}));

giftingOnTheFly.on(updateGiftingOnTheFlyRequest, state => ({
  ...state,
  status: StateStatus.Pending,
}));
giftingOnTheFly.on(updateGiftingOnTheFlySuccess, (state, { isEnabled }) => ({
  ...state,
  status: StateStatus.Fulfilled,
  data: {
    isEnabled,
  },
}));
giftingOnTheFly.on(updateGiftingOnTheFlyFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
