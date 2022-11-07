import { createReducer } from 'redux-act';

import { TForgottenRequestErrors } from './rightToBeForgotten.types';
import * as actions from './rightToBeForgotten.actions';

export interface IRightToBeForgottenState {
  isLoading: boolean;
  isLoaded: boolean;
  errors: TForgottenRequestErrors;
}

const initialState: IRightToBeForgottenState = {
  isLoading: false,
  isLoaded: false,
  errors: {},
};

const rightToBeForgotten = createReducer({}, initialState);

rightToBeForgotten.on(actions.sendRightToBeForgotten, state => ({
  ...state,
  isLoading: true,
  isLoaded: false,
  errors: {},
}));

rightToBeForgotten.on(actions.sendRightToBeForgottenSuccess, state => ({
  ...state,
  isLoading: false,
  isLoaded: true,
}));

rightToBeForgotten.on(actions.sendRightToBeForgottenFail, (state, errors) => ({
  ...state,
  isLoading: false,
  isLoaded: false,
  errors,
}));

export { rightToBeForgotten };
