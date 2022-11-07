import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators/index';
import { of } from 'rxjs';

import { GET_GIFT_BY_HASH_ID_REQUEST } from './redirect.types';
import { getGiftByHashIdSuccess, getGiftByHashIdError } from './redirect.actions';

export const loadGiftByHashIdEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(GET_GIFT_BY_HASH_ID_REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/gifts/info-by-hash/${payload}`).pipe(
        map(response => getGiftByHashIdSuccess(response.gift)),
        catchError(error => of(getGiftByHashIdError(error))),
      ),
    ),
  );

export const redirectEpics = [loadGiftByHashIdEpic];
