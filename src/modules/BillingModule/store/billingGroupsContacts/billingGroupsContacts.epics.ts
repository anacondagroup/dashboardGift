import { ofType } from '@alycecom/utils';
import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { handlers, handleError, MessageType, TrackEvent, IListResponse } from '@alycecom/services';

import { IBillingContact } from './billingGroupsContacts.types';
import {
  getBillingContactListRequest,
  getBillingContactListSuccess,
  getBillingContactListFail,
} from './billingGroupsContacts.actions';

export const getBillingContactsEpic: Epic = (
  action$,
  state$,
  { salesforceApiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(getBillingContactListRequest),
    switchMap(action =>
      salesforceApiService.get(`/invoicing/accounts/${action.payload.orgId}/contacts`, {}, true).pipe(
        map((response: IListResponse<IBillingContact>) => getBillingContactListSuccess(response)),
        catchError(
          handleError(
            handlers.handleAnyError(getBillingContactListFail),
            handlers.handleErrorsAsText(
              (error: string) =>
                showGlobalMessage({
                  text: `Error loading Contact List. ${error}`,
                  type: MessageType.Error,
                }),
              (error: string) =>
                TrackEvent.actions.trackEvent({
                  name: 'Manage Billing - Billing Groups - Create/Edit Billing Group - Load Contact List Failed',
                  payload: { data: action.payload, error },
                }),
            ),
          ),
        ),
      ),
    ),
  );

export default [getBillingContactsEpic];
