import { createReducer } from 'redux-act';

import {
  loadEmailTypesRequest,
  loadEmailTypesSuccess,
  loadEmailTypesFail,
  resetEmailTypes,
} from './emailTypes.actions';
import { IEmailType } from './emailTypes.types';

export interface IEmailTypesState {
  isLoading: boolean;
  isLoaded: boolean;
  items: IEmailType[];
}

export const initialState: IEmailTypesState = {
  isLoading: false,
  isLoaded: false,
  items: [],
};

const reducer = createReducer<IEmailTypesState>({}, initialState);

reducer
  .on(loadEmailTypesRequest, state => ({
    ...state,
    isLoading: true,
    isLoaded: false,
  }))
  .on(loadEmailTypesSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: true,
    items: payload,
  }))
  .on(loadEmailTypesFail, state => ({
    ...state,
    isLoading: false,
    isLoaded: false,
  }));

reducer.on(resetEmailTypes, state => ({
  ...state,
  ...initialState,
}));

export default reducer;
