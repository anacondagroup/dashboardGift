import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import { loadBrandingFail, loadBrandingRequest, loadBrandingSuccess } from './branding.actions';

export interface IBrandingState {
  status: StateStatus;
  brandingLink: string;
  hasBranding: boolean;
  owner: string | null;
}

export const initialState: IBrandingState = {
  status: StateStatus.Idle,
  brandingLink: '',
  hasBranding: false,
  owner: null,
};

export const branding = createReducer<IBrandingState>({}, initialState);

branding
  .on(loadBrandingRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(loadBrandingSuccess, (state, { hasBranding, owner, brandingLink }) => ({
    ...state,
    status: StateStatus.Fulfilled,
    hasBranding,
    brandingLink,
    owner,
  }))
  .on(loadBrandingFail, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));
