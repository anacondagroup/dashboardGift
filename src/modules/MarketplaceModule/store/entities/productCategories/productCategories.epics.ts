import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, map, switchMap } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';

import {
  fetchProductCategories,
  fetchProductCategoriesFail,
  fetchProductCategoriesSuccess,
} from './productCategories.actions';
import { TProductCategory } from './productCategories.types';

const fetchProductCategoriesEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchProductCategories),
    switchMap(() =>
      apiService.get('/api/v1/marketplace/filters/products-categories', null, true).pipe(
        map((response: { data: TProductCategory[] }) => fetchProductCategoriesSuccess(response.data)),
        catchError(handleError(handlers.handleAnyError(fetchProductCategoriesFail))),
      ),
    ),
  );

export default [fetchProductCategoriesEpic];
