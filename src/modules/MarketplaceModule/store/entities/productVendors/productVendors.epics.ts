import { Epic } from 'redux-observable';
import qs from 'query-string';
import { ofType } from '@alycecom/utils';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';

import * as actions from './productVendors.actions';
import { TProductVendor } from './productVendors.types';

const fetchProductVendorsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(actions.fetchProductVendors),
    debounceTime(300),
    switchMap(({ payload: { campaignId, teamIds } }) =>
      apiService
        .get(
          `/api/v1/marketplace/products-vendors?${qs.stringify(
            { campaignId, teamIds },
            { arrayFormat: 'comma', skipNull: true },
          )}`,
          null,
          true,
        )
        .pipe(
          map((response: { data: TProductVendor[] }) => actions.fetchProductVendorsSuccess(response.data)),
          catchError(handleError(handlers.handleAnyError(actions.fetchProductVendorsFail))),
        ),
    ),
  );

export default [fetchProductVendorsEpic];
