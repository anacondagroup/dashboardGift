import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { switchMap, map, catchError } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';

import {
  fetchCustomMarketplaces,
  fetchCustomMarketplacesSuccess,
  fetchCustomMarketplacesFail,
} from './customMarketplaces.actions';
import { TShortCustomMarketplace } from './customMarketplaces.types';

const fetchCustomMarketplacesEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchCustomMarketplaces),
    switchMap(() =>
      apiService.get('/api/v1/marketplace/custom', null, true).pipe(
        map((response: { data: TShortCustomMarketplace[] }) => fetchCustomMarketplacesSuccess(response.data)),
        catchError(handleError(handlers.handleAnyError(fetchCustomMarketplacesFail))),
      ),
    ),
  );

export default [fetchCustomMarketplacesEpic];
