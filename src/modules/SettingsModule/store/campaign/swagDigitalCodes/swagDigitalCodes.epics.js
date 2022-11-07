import { ofType } from 'redux-observable';
import { catchError, mergeMap, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { from, timer } from 'rxjs';

import { swagCodesBatchesUpdatingEnd, swagCodesSettingsAllSettingsSuccess } from '../swagBatches/swagBatches.actions';
import { SWAG_SELECT_CLEAR_DATA_ON_CLOSE_SIDEBAR } from '../swagSelect/swagSelect.types';

import {
  SWAG_DIGITAL_GENERATE_CODES_REQUEST,
  SWAG_DIGITAL_GENERATION_CODES_PROGRESS_FINISH,
  SWAG_DIGITAL_GENERATION_CODES_PROGRESS_REQUEST,
  SWAG_DIGITAL_UPDATE_BATCHES_REQUEST,
} from './swagDigitalCodes.types';
import {
  swagDigitalGenerateCodesSuccess,
  swagDigitalGenerationCodesProgressFinish,
  swagDigitalGenerationCodesProgressSuccess,
} from './swagDigitalCodes.actions';
import { getSwagDigitalGenerateCodesData } from './swagDigitalCodes.selectors';

const swagDigitalGenerateCodesEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage, ERRORS } },
) =>
  action$.pipe(
    ofType(SWAG_DIGITAL_GENERATE_CODES_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/generate-codes`, {
          body: getSwagDigitalGenerateCodesData(state),
        })
        .pipe(
          mergeMap(({ codesCreationRequestId }) => [
            showGlobalMessage({ type: 'success', text: 'Generate codes job has been queued' }),
            swagDigitalGenerateCodesSuccess(codesCreationRequestId),
          ]),
          catchError(errorHandler({ message: ERRORS.SOMETHING_WRONG })),
        ),
    ),
  );

const swagDigitalCodesGenerationProgress = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage, ERRORS } },
) => {
  const stopPolling$ = action$.pipe(
    ofType(SWAG_DIGITAL_GENERATION_CODES_PROGRESS_FINISH, SWAG_SELECT_CLEAR_DATA_ON_CLOSE_SIDEBAR),
  );
  return action$.pipe(
    ofType(SWAG_DIGITAL_GENERATION_CODES_PROGRESS_REQUEST),
    switchMap(({ payload }) =>
      timer(0, 2000).pipe(
        takeUntil(stopPolling$),
        switchMap(() =>
          from(
            apiService
              .get(
                `/enterprise/swag/campaign/${payload.campaignId}/check-codes-creation-status?codesCreationRequestId=${payload.requestId}`,
              )
              .pipe(
                mergeMap(({ codesAmount, createdCodesAmount, isFinished, codesCsvFileUrl, codesBatchId }) => {
                  if (isFinished) {
                    return [
                      swagDigitalGenerationCodesProgressSuccess({
                        codesAmount,
                        isFinished,
                        codesCsvFileUrl,
                        createdCodesAmount,
                      }),
                      swagDigitalGenerationCodesProgressFinish(),
                      showGlobalMessage({ type: 'success', text: `${codesAmount} codes have been generated` }),
                    ];
                  }
                  return [swagDigitalGenerationCodesProgressSuccess({ createdCodesAmount, codesBatchId })];
                }),
                catchError(errorHandler({ message: ERRORS.SOMETHING_WRONG })),
              ),
          ),
        ),
      ),
    ),
  );
};

const swagDigitalCodesUpdateBatches = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage, ERRORS } },
) =>
  action$.pipe(
    ofType(SWAG_DIGITAL_UPDATE_BATCHES_REQUEST),
    mergeMap(({ payload }) =>
      apiService
        .post(`/enterprise/swag/campaign/${payload.campaignId}/update-batches`, {
          body: { batches: payload.data },
        })
        .pipe(
          mergeMap(({ batches, teamId }) => [
            swagCodesBatchesUpdatingEnd(),
            swagCodesSettingsAllSettingsSuccess({ batches, teamId }),
            showGlobalMessage({ type: 'success', text: 'Changes has been saved' }),
          ]),
          catchError(errorHandler({ message: ERRORS.SOMETHING_WRONG })),
        ),
    ),
  );

export const swagDigitalCodesEpics = [
  swagDigitalGenerateCodesEpic,
  swagDigitalCodesGenerationProgress,
  swagDigitalCodesUpdateBatches,
];
