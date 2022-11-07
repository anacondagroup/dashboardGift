import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers, IResponse } from '@alycecom/services';
import qs from 'query-string';

import {
  getPriceAvailabilityRequest,
  getPriceAvailabilityFail,
  getPriceAvailabilitySuccess,
} from './priceAvailability.actions';
import { IPriceAvailability } from './priceAvailability.types';

export const getPriceAvailabilityEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(getPriceAvailabilityRequest),
    switchMap(({ payload: { campaignId } }) =>
      apiService
        .get(`/api/v1/marketplace/products-price-availability?${qs.stringify({ campaignId })}`, null, true)
        .pipe(
          map(({ data }: IResponse<IPriceAvailability>) => getPriceAvailabilitySuccess(data)),
          catchError(handleError(handlers.handleAnyError(getPriceAvailabilityFail))),
        ),
    ),
  );

export default [getPriceAvailabilityEpic];
