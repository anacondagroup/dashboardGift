import { createReducer } from 'redux-act';

import { showNotification } from './notifications.actions';

export interface TShowNotification {
  status: boolean | null;
}

export const initialState: TShowNotification = {
  status: false,
};

export default createReducer({}, initialState).on(showNotification, (state, payload) => ({
  ...state,
  status: payload,
}));
