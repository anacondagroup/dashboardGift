import { createReducer } from 'redux-act';
import { TLegacyErrors } from '@alycecom/services';

import {
  createCampaignFail,
  createCampaignRequest,
  createCampaignSuccess,
  resetErrors,
} from './createCampaign.actions';

export interface ICreateCampaignState {
  isLoading: boolean;
  errors: TLegacyErrors;
}

export const createCampaignInitialState: ICreateCampaignState = {
  isLoading: false,
  errors: {},
};

export default createReducer({}, createCampaignInitialState)
  .on(createCampaignRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(createCampaignSuccess, state => ({
    ...state,
    isLoading: false,
  }))
  .on(createCampaignFail, (state, errors) => ({
    ...state,
    isLoading: false,
    errors,
  }))
  .on(resetErrors, state => ({
    ...state,
    errors: {},
  }));
