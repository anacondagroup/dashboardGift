import { combineReducers } from 'redux';

import { createPage, ICreatePageState } from './createPage';
import { status, TStatusState } from './status/status.reducer';

export interface IActivateUIState {
  createPage: ICreatePageState;
  status: TStatusState;
}

export const ui = combineReducers<IActivateUIState>({
  createPage,
  status,
});
