import { createReducer } from 'redux-act';

import { setNewPasswordFail, setNewPasswordRequest, setNewPasswordSuccess } from './confirmation.actions';

export interface IConfirmationState {
  setPasswordInProgress: boolean;
}

export const initialConfirmationState: IConfirmationState = {
  setPasswordInProgress: false,
};

const confirmationReducer = createReducer({}, initialConfirmationState)
  .on(setNewPasswordRequest, state => ({
    ...state,
    setPasswordInProgress: true,
  }))
  .on(setNewPasswordSuccess, state => ({
    ...state,
    setPasswordInProgress: false,
  }))
  .on(setNewPasswordFail, state => ({
    ...state,
    setPasswordInProgress: false,
  }));

export default confirmationReducer;
