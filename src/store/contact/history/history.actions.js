import { HISTORY_LOAD_REQUEST, HISTORY_LOAD_SUCCESS, HISTORY_LOAD_FAIL } from './history.types';

export const historyLoadRequest = contactId => ({
  type: HISTORY_LOAD_REQUEST,
  payload: contactId,
});

export const historyLoadSuccess = history => ({
  type: HISTORY_LOAD_SUCCESS,
  payload: history,
});

export const historyLoadFail = error => ({
  type: HISTORY_LOAD_FAIL,
  payload: error,
});
