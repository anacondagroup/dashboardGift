import { ofType } from '@alycecom/utils';
import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';

import {
  loadGiftLimitsFail,
  loadGiftLimitsRequest,
  loadGiftLimitsSuccess,
  updateGiftLimitsFail,
  updateGiftLimitsRequest,
  updateGiftLimitsSuccess,
} from './giftLimits.actions';
import { IGiftLimitsResponse } from './giftLimits.types';

const loadGiftLimitsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadGiftLimitsRequest),
    switchMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/campaigns/${payload.campaignId}/gift-limits`).pipe(
        map((response: IGiftLimitsResponse) => loadGiftLimitsSuccess(response.gift_limits)),
        catchError(handleError(handlers.handleAnyError(loadGiftLimitsFail))),
      ),
    ),
  );

const updateGiftLimitsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateGiftLimitsRequest),
    switchMap(({ payload }) =>
      apiService
        .post(`/enterprise/dashboard/campaigns/${payload.campaignId}/gift-limits`, {
          body: { gift_limits: payload.giftLimits },
        })
        .pipe(
          mergeMap((response: IGiftLimitsResponse) => [
            updateGiftLimitsSuccess(response.gift_limits),
            showGlobalMessage({ text: 'Changes saved', type: 'success' }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateGiftLimitsFail))),
        ),
    ),
  );

export default [loadGiftLimitsEpic, updateGiftLimitsEpic];
