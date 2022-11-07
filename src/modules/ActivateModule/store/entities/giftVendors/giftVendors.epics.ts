import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { handlers } from '@alycecom/services';

import { ActivateModes } from '../../../routePaths';
import { getActivateModuleParams } from '../../activate.selectors';

import { loadGiftVendorsRequest, loadGiftVendorsSuccess, loadGiftVendorsFail } from './giftVendors.actions';
import { IGiftVendorsResponse, IOldGiftVendorsResponse, isModernGiftVendorsResponse } from './giftVendors.types';
import { transformOldGiftVendorToGiftVendor } from './giftVendors.helpers';

const getGiftVendorsEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/enterprise/activate/marketplace/${campaignId}/vendors`;
  }
  return `/enterprise/dashboard/campaigns/${campaignId}/vendors`;
};

const loadGiftTypesEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadGiftVendorsRequest),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: { campaignId },
        },
        state,
      ]) => {
        const { mode } = getActivateModuleParams(state);
        return apiService.get(getGiftVendorsEndpoint(campaignId as number, mode as ActivateModes)).pipe(
          map((response: IGiftVendorsResponse | IOldGiftVendorsResponse) => {
            if (isModernGiftVendorsResponse(response)) {
              return response.giftVendors;
            }

            return response.vendors.map(transformOldGiftVendorToGiftVendor);
          }),
          map(loadGiftVendorsSuccess),
          catchError(apiService.handleError(handlers.handleAnyError(loadGiftVendorsFail))),
        );
      },
    ),
  );

export const giftVendorsEpics = [loadGiftTypesEpic];
