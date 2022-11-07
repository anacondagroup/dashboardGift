import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators/index';
import { of } from 'rxjs';

import { HISTORY_LOAD_REQUEST } from './history.types';
import { historyLoadSuccess, historyLoadFail } from './history.actions';
import { buildApiUrl } from './history.selectors';

export const loadHistoryEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(HISTORY_LOAD_REQUEST),
    mergeMap(action =>
      apiService.get(buildApiUrl(action.payload)).pipe(
        map(response => historyLoadSuccess(response.gifts)),
        catchError(error => of(historyLoadFail(error))),
      ),
    ),
  );

export const historyEpics = [loadHistoryEpic];
