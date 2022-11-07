import { createReducer } from 'redux-act';

import {
  loadEmailPreviewRequest,
  loadEmailPreviewSuccess,
  loadEmailPreviewFail,
  resetEmailPreview,
} from './emailPreview.actions';

export interface IEmailPreviewState {
  isLoading: boolean;
  isLoaded: boolean;
  content: string;
}

export const initialState: IEmailPreviewState = {
  isLoading: false,
  isLoaded: false,
  content: '',
};

const reducer = createReducer<IEmailPreviewState>({}, initialState);

reducer
  .on(loadEmailPreviewRequest, state => ({
    ...state,
    isLoading: true,
    isLoaded: false,
  }))
  .on(loadEmailPreviewSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: true,
    content: payload,
  }))
  .on(loadEmailPreviewFail, state => ({
    ...state,
    isLoading: false,
    isLoaded: false,
  }));

reducer.on(resetEmailPreview, state => ({
  ...state,
  ...initialState,
}));

export default reducer;
