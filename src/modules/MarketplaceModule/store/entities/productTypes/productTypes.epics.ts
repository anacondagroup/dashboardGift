import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, map, switchMap } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';
import qs from 'query-string';

import * as actions from './productTypes.actions';
import * as types from './productTypes.types';

const fetchProductTypesEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(actions.fetchProductTypes),
    switchMap(({ payload }) =>
      apiService
        .get(
          `/api/v1/marketplace/products-types?${qs.stringify(payload || {}, {
            arrayFormat: 'comma',
            skipNull: true,
            encode: true,
          })}`,
          null,
          true,
        )
        .pipe(
          map((response: { data: types.TProductType[] }) => actions.fetchProductTypesSuccess(response.data)),
          catchError(handleError(handlers.handleAnyError(actions.fetchProductTypesFail))),
        ),
    ),
  );

export default [fetchProductTypesEpic];
