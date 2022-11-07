import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';

import { getActivateModuleParams } from '../activate.selectors';
import { updateMarketplaceSettingsSuccess } from '../steps/gift';

import { fetchProductsCount, fetchProductsCountFail, fetchProductsCountSuccess } from './productsCount.actions';

export const fetchProductsCountEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchProductsCount),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { campaignId, isEditorMode } = getActivateModuleParams(state);

      const fetchProductsByCampaignId = () =>
        apiService
          .get(`/enterprise/marketplace/campaigns/${campaignId}/count-products`)
          .pipe(map((response: { count: number }) => response.count));

      const fetchProductsByDraftId = () =>
        apiService
          .get(`/api/v1/campaigns/activate/drafts-v2/${campaignId}/marketplace/count-products`, null, true)
          .pipe(map((response: IResponse<{ productsCount: number }>) => response.data.productsCount));

      return (isEditorMode ? fetchProductsByCampaignId() : fetchProductsByDraftId()).pipe(
        map((count: number) => fetchProductsCountSuccess({ count })),
        catchError(handleError(handlers.handleAnyError(fetchProductsCountFail))),
      );
    }),
  );

export const reFetchProductsCountOnMarketplaceUpdated: Epic = action$ =>
  action$.pipe(
    ofType(updateMarketplaceSettingsSuccess),
    map(() => fetchProductsCount()),
  );

export default [fetchProductsCountEpic, reFetchProductsCountOnMarketplaceUpdated];
