import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { IProductDetails } from '@alycecom/ui';
import { handleError, handlers } from '@alycecom/services';

import { loadProductDetailsRequest, loadProductDetailsSuccess, loadProductDetailsFail } from './productDetails.actions';

export const loadProductDetailsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadProductDetailsRequest),
    switchMap(({ payload: { productId, localPrice } }) =>
      apiService.get(`/api/v1/marketplace/products/${productId}`, null, true).pipe(
        map(({ data }: { data: IProductDetails }) => loadProductDetailsSuccess({ ...data, localPrice })),
        catchError(handleError(handlers.handleAnyError(loadProductDetailsFail))),
      ),
    ),
  );

export const productDetailsEpics = [loadProductDetailsEpic];
