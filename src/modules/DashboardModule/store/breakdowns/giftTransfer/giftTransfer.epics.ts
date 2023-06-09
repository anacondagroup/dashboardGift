import { catchError, map, mergeMap, takeUntil, switchMap, debounceTime } from 'rxjs/operators';
import { from, timer } from 'rxjs';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';
import { Epic } from 'redux-observable';

import { giftBreakdownRequest } from '../gift/gift.actions';

import {
  deleteAllGiftsFromTransferSelection,
  giftDisableFail,
  giftDisableRequest,
  giftDisableSuccess,
  giftExpireFail,
  giftExpireRequest,
  giftExpireSuccess,
  giftTransferringFail,
  giftTransferringProgressFinish,
  giftTransferringProgressRequest,
  giftTransferringProgressSuccess,
  giftTransferringRequest,
  giftTransferringSuccess,
  giftUnExpireFail,
  giftUnExpireRequest,
  giftUnExpireSuccess,
  loadAllowedCampaignsFail,
  loadAllowedCampaignsRequest,
  loadAllowedCampaignsSuccess,
} from './giftTransfer.actions';
import { ICampaign } from './giftTransfer.types';

export const loadGiftTransferringId: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(giftTransferringRequest),
    debounceTime(300),
    switchMap(({ payload }) =>
      apiService
        .post(`/enterprise/dashboard/gifts/transition/move`, {
          body: { gift_ids: payload.giftIds, target_campaign_id: payload.targetCampaignId },
        })
        .pipe(
          // eslint-disable-next-line camelcase
          map((response: { transition_request_id: number }) =>
            giftTransferringSuccess({ transferringId: response.transition_request_id }),
          ),
          catchError(
            errorHandler({
              callbacks: giftTransferringFail,
              showErrorsAsGlobal: true,
              message: 'Transferring error, please try again',
            }),
          ),
        ),
    ),
  );

export const loadGiftTransferringProgress: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) => {
  const stopPolling$ = action$.pipe(ofType(giftTransferringProgressFinish));

  return action$.pipe(
    ofType(giftTransferringProgressRequest),
    switchMap(({ payload }) =>
      timer(0, 2000).pipe(
        takeUntil(stopPolling$),
        switchMap(() =>
          from(
            apiService
              .get(
                `/enterprise/dashboard/gifts/transition/status-check?transition_request_id=${payload.transferringId}`,
              )
              .pipe(
                mergeMap(
                  ({
                    moved_gifts_amount: completed,
                    all_gifts_amount: all,
                    is_finished: isFinished,
                    campaign_name: campaignName = 'campaign',
                  }) => {
                    if (isFinished) {
                      return [
                        giftTransferringProgressSuccess({ completed }),
                        giftTransferringProgressFinish(),
                        showGlobalMessage({ type: 'success', text: `${all} gifts moved to ${campaignName}` }),
                      ];
                    }
                    return [giftTransferringProgressSuccess({ completed })];
                  },
                ),
              ),
          ),
        ),
      ),
    ),
  );
};

export const loadAllowedCampaignsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadAllowedCampaignsRequest),
    switchMap(({ payload }) =>
      apiService
        .get(
          `/enterprise/dashboard/gifts/transition/allowed-campaigns?team_id=${payload.teamId}${
            payload.campaignId ? `&campaign_id=${payload.campaignId}` : ''
          }`,
        )
        .pipe(
          map((response: { campaigns: ICampaign[] }) => loadAllowedCampaignsSuccess(response)),
          catchError(handleError(handlers.handleAnyError(loadAllowedCampaignsFail))),
        ),
    ),
  );

export const giftExpireEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(giftExpireRequest),
    switchMap(({ payload }) =>
      apiService
        .post(
          '/api/v1/gifts/bulk/expire',
          {
            body: {
              giftIds: payload.giftIds,
            },
          },
          true,
        )
        .pipe(
          mergeMap(() => [giftExpireSuccess(), deleteAllGiftsFromTransferSelection(), giftBreakdownRequest(payload)]),
          catchError(handleError(handlers.handleAnyError(giftExpireFail))),
        ),
    ),
  );

export const giftUnExpireEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(giftUnExpireRequest),
    switchMap(({ payload }) =>
      apiService
        .post(
          '/api/v1/gifts/bulk/unexpire',
          {
            body: {
              giftIds: payload.giftIds,
            },
          },
          true,
        )
        .pipe(
          mergeMap(() => [giftUnExpireSuccess(), deleteAllGiftsFromTransferSelection(), giftBreakdownRequest(payload)]),
          catchError(handleError(handlers.handleAnyError(giftUnExpireFail))),
        ),
    ),
  );

export const giftDisableEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(giftDisableRequest),
    switchMap(({ payload }) =>
      apiService
        .post(
          '/api/v1/gifts/bulk/disable',
          {
            body: {
              giftIds: payload.giftIds,
            },
          },
          true,
        )
        .pipe(
          mergeMap(() => [giftDisableSuccess(), deleteAllGiftsFromTransferSelection(), giftBreakdownRequest(payload)]),
          catchError(handleError(handlers.handleAnyError(giftDisableFail))),
        ),
    ),
  );

export default [
  giftExpireEpic,
  giftUnExpireEpic,
  giftDisableEpic,
  loadGiftTransferringId,
  loadGiftTransferringProgress,
  loadAllowedCampaignsEpic,
];
