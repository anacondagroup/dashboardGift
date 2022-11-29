import { createReducer } from 'redux-act';
import { StateStatus } from '@alycecom/utils';

import {
  loadEmailPreviewFail,
  loadEmailPreviewRequest,
  loadEmailPreviewSuccess,
  resetEmailPreview,
} from './emailPreview.actions';

export interface IEmailPreviewState {
  status: StateStatus;
  content: string;
}

export const initialState: IEmailPreviewState = {
  status: StateStatus.Idle,
  content: '',
};

const reducer = createReducer<IEmailPreviewState>({}, initialState);

reducer
  .on(loadEmailPreviewRequest, state => ({
    ...state,
    status: StateStatus.Pending,
  }))
  .on(loadEmailPreviewSuccess, (state, payload) => ({
    ...state,
    status: StateStatus.Fulfilled,
    content: payload,
  }))
  .on(loadEmailPreviewFail, state => ({
    ...state,
    status: StateStatus.Rejected,
  }));

reducer.on(resetEmailPreview, state => ({
  ...state,
  ...initialState,
}));

export default reducer;
