import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { handlers } from '@alycecom/services';

import { getActivateModuleParams } from '../../activate.selectors';
import { ActivateModes } from '../../../routePaths';

import { loadGiftTypesRequest, loadGiftTypesSuccess, loadGiftTypesFail } from './giftTypes.actions';
import { IGiftTypeResponse, IOldGiftTypesResponse, isModernGiftTypesResponse } from './giftTypes.types';
import { transformOlgGiftTypeToGiftType } from './giftTypes.helpers';

const getGiftTypesEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/enterprise/activate/marketplace/${campaignId}/types`;
  }
  return `/enterprise/dashboard/campaigns/${campaignId}/types`;
};

const loadGiftTypesEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadGiftTypesRequest),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: { campaignId },
        },
        state,
      ]) => {
        const { mode } = getActivateModuleParams(state);
        return apiService.get(getGiftTypesEndpoint(campaignId as number, mode as ActivateModes)).pipe(
          map((response: IGiftTypeResponse | IOldGiftTypesResponse) => {
            if (isModernGiftTypesResponse(response)) {
              return response.giftTypes;
            }

            return response.types.map(transformOlgGiftTypeToGiftType);
          }),
          map(loadGiftTypesSuccess),
          catchError(apiService.handleError(handlers.handleAnyError(loadGiftTypesFail))),
        );
      },
    ),
  );

export const giftTypesEpics = [loadGiftTypesEpic];
