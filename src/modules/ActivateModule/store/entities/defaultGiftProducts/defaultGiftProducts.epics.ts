import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';

import { ActivateModes } from '../../../routePaths';
import { getActivateModuleParams } from '../../activate.selectors';

import {
  loadDefaultGiftProductsFail,
  loadDefaultGiftProductsRequest,
  loadDefaultGiftProductsSuccess,
} from './defaultGiftProducts.actions';
import { TProduct } from './defaultGiftProducts.types';

const getDefaultGiftProductsEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/leading-gifts`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/leading-gifts`;
};

export const loadDefaultGiftProductsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadDefaultGiftProductsRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const { mode } = getActivateModuleParams(state);
      return apiService.get(getDefaultGiftProductsEndpoint(payload.campaignId, mode as ActivateModes), null, true).pipe(
        map((response: IResponse<TProduct[]>) => loadDefaultGiftProductsSuccess(response.data)),
        catchError(handleError(handlers.handleAnyError(loadDefaultGiftProductsFail))),
      );
    }),
  );

export default [loadDefaultGiftProductsEpic];
