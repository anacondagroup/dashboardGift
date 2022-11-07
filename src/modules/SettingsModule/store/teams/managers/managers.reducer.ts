import { createReducer } from 'redux-act';

import { loadManagersRequest, loadManagersSuccess, loadManagersFail } from './managers.actions';
import { IUser } from './managers.types';

export interface IManagersState {
  isLoading: boolean;
  managers: IUser[];
}

export const initialState: IManagersState = {
  isLoading: false,
  managers: [],
};

const reducer = createReducer<IManagersState>({}, initialState);

reducer
  .on(loadManagersRequest, state => ({
    ...state,
    isLoading: true,
  }))
  .on(loadManagersSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    managers: payload.managers,
  }))
  .on(loadManagersFail, state => ({
    ...state,
    isLoading: false,
  }));

export default reducer;
