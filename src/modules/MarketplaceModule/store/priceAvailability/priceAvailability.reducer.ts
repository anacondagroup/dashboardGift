import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import {
  getPriceAvailabilityRequest,
  getPriceAvailabilityFail,
  getPriceAvailabilitySuccess,
} from './priceAvailability.actions';
import { IPriceAvailability } from './priceAvailability.types';

export interface IPriceAvailabilityState {
  status: StateStatus;
  data: IPriceAvailability;
}

export const initialPriceAvailabilityState: IPriceAvailabilityState = {
  status: StateStatus.Idle,
  data: {
    isPhysicalAvailable: true,
    isDigitalAvailable: true,
    isDonationAvailable: true,
  },
};

export const priceAvailability = createReducer({}, initialPriceAvailabilityState)
  .on(getPriceAvailabilityRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(getPriceAvailabilitySuccess, (state, data) => ({
    ...state,
    status: StateStatus.Fulfilled,
    data,
  }))
  .on(getPriceAvailabilityFail, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
