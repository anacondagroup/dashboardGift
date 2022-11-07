import { ofType } from 'redux-observable';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { GSP_STEP_3, GSP_STEP_4 } from '../../../../../constants/swagPhysical.constants';

import { getSwagPhysicalGenerateCodesData } from './swagPhysicalCodes.selectors';
import { SWAG_PHYSICAL_GENERATE_CODES_REQUEST, SWAG_PHYSICAL_CAMPAIGN_DATA_REQUEST } from './swagPhysicalCodes.types';
import {
  swagPhysicalCampaignDataFail,
  swagPhysicalCampaignDataSuccess,
  swagPhysicalCodesChangeStep,
  swagPhysicalGenerateCodesSuccess,
} from './swagPhysicalCodes.actions';

const getCampaignDataForNewBatchEpic = (action$, state$, { apiService, messagesService: { errorHandler, ERRORS } }) =>
  action$.pipe(
    ofType(SWAG_PHYSICAL_CAMPAIGN_DATA_REQUEST),
    switchMap(({ payload }) =>
      apiService.get(`/enterprise/swag/campaign/${payload}/batch-data`).pipe(
        mergeMap(response => [
          swagPhysicalCampaignDataSuccess(response),
          swagPhysicalCodesChangeStep({
            next: GSP_STEP_3,
          }),
        ]),
        catchError(errorHandler({ callbacks: swagPhysicalCampaignDataFail, message: ERRORS.SOMETHING_WRONG })),
      ),
    ),
  );

const swagPhysicalGenerateCodesEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage, ERRORS } },
) =>
  action$.pipe(
    ofType(SWAG_PHYSICAL_GENERATE_CODES_REQUEST),
    withLatestFrom(state$),
    switchMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/create-order`, {
          body: getSwagPhysicalGenerateCodesData(state),
        })
        .pipe(
          mergeMap(() => [
            showGlobalMessage({ type: 'success', text: 'Generate codes job has been queued' }),
            swagPhysicalCodesChangeStep({
              current: GSP_STEP_3,
              data: { isConfirmed: true },
              next: GSP_STEP_4,
            }),
            swagPhysicalGenerateCodesSuccess(),
          ]),
          catchError(errorHandler({ message: ERRORS.SOMETHING_WRONG })),
        ),
    ),
  );

export const swagPhysicalGenerateCodesEpics = [getCampaignDataForNewBatchEpic, swagPhysicalGenerateCodesEpic];
