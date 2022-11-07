import { createReducer } from 'redux-act';

import { loadBrandingRequest, loadBrandingSuccess, loadBrandingFail } from './branding.actions';

export interface IBrandingState {
  isLoading: boolean;
  brandingLink: string;
  hasBranding: boolean;
  owner: string | null;
}

export const initialState: IBrandingState = {
  isLoading: false,
  brandingLink: '',
  hasBranding: false,
  owner: null,
};

const reducer = createReducer<IBrandingState>({}, initialState);

reducer
  .on(loadBrandingRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadBrandingSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    ...payload,
  }))
  .on(loadBrandingFail, state => ({
    ...state,
    isLoading: false,
  }));

export default reducer;
