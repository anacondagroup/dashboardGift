import { Epic, ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';

import { fetchOrganizationSubscriptions } from './subscription.actions';
import { TOrganizationSubscriptionsResponse } from './subscription.types';

const loadOrganizationSubscriptionsEpic: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(fetchOrganizationSubscriptions),
    switchMap(() =>
      apiGateway.get(`/marketing/workato/subscription`, null, true).pipe(
        map((response: TOrganizationSubscriptionsResponse) => fetchOrganizationSubscriptions.fulfilled(response)),
        catchError(handleError(handlers.handleAnyError(fetchOrganizationSubscriptions.rejected()))),
      ),
    ),
  );

export const subscriptionEpics = [loadOrganizationSubscriptionsEpic];
