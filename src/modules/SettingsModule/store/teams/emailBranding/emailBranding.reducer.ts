import { createReducer } from 'redux-act';

import { loadEmailBrandingRequest, loadEmailBrandingSuccess, loadEmailBrandingFail } from './emailBranding.actions';

export interface IEmailBrandingState {
  isLoading: boolean;
  hasEmailBranding: boolean;
}

export const initialState: IEmailBrandingState = {
  isLoading: false,
  hasEmailBranding: false,
};

const reducer = createReducer<IEmailBrandingState>({}, initialState);

reducer
  .on(loadEmailBrandingRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadEmailBrandingSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    ...payload,
  }))
  .on(loadEmailBrandingFail, state => ({
    ...state,
    isLoading: false,
  }));

export default reducer;
