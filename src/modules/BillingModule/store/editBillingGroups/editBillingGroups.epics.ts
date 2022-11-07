import { ofType } from '@alycecom/utils';
import { Epic } from 'redux-observable';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { handlers, handleError, MessageType, TrackEvent } from '@alycecom/services';

import { getGroupsListRequest } from '../billingGroups/billingGroups.actions';

import { TCreateBillingGroupResponse } from './editBillingGroups.types';
import {
  createBillingGroupFail,
  createBillingGroupRequest,
  createBillingGroupSuccess,
  updateBillingGroupRequest,
  updateBillingGroupSuccess,
  updateBillingGroupFail,
} from './editBillingGroups.actions';

export const createGroupEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(createBillingGroupRequest),
    switchMap(action =>
      apiService
        .post(
          '/api/v1/groups',
          {
            body: action.payload,
          },
          true,
        )
        .pipe(
          mergeMap((response: TCreateBillingGroupResponse) => [
            createBillingGroupSuccess(response),
            getGroupsListRequest({ isSearching: false }),
            TrackEvent.actions.trackEvent({
              name: 'Manage Billing - Billing Groups - Create Billing Group Success',
              payload: action.payload,
            }),
            showGlobalMessage({
              type: 'success',
              text: `Success! Your group called ${action.payload.name} has been added`,
            }),
          ]),
          catchError(
            handleError(
              handlers.handleAnyError(createBillingGroupFail),
              handlers.handleErrorsAsText(
                (error: string) =>
                  showGlobalMessage({
                    text: `Error saving Billing Group. ${error}`,
                    type: MessageType.Error,
                  }),
                (error: string) =>
                  TrackEvent.actions.trackEvent({
                    name: 'Manage Billing - Billing Groups - Create Billing Group Failed',
                    payload: { data: action.payload, error },
                  }),
              ),
            ),
          ),
        ),
    ),
  );

export const updateGroupEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateBillingGroupRequest),
    switchMap(action =>
      apiService
        .patch(
          `/api/v1/groups`,
          {
            body: action.payload,
          },
          true,
        )
        .pipe(
          mergeMap((response: TCreateBillingGroupResponse) => [
            updateBillingGroupSuccess(response),
            getGroupsListRequest({ isSearching: false }),
            TrackEvent.actions.trackEvent({
              name: 'Manage Billing - Billing Groups - Update Billing Group Success',
              payload: action.payload,
            }),
            showGlobalMessage({
              type: 'success',
              text: `Success! A group called ${action.payload.name} was updated`,
            }),
          ]),
          catchError(
            handleError(
              handlers.handleAnyError(updateBillingGroupFail),
              handlers.handleErrorsAsText(
                (error: string) =>
                  showGlobalMessage({
                    text: `Error updating Billing Group. ${error}`,
                    type: MessageType.Error,
                  }),
                (error: string) =>
                  TrackEvent.actions.trackEvent({
                    name: 'Manage Billing - Billing Groups - Update Billing Group Failed',
                    payload: { data: action.payload, error },
                  }),
              ),
            ),
          ),
        ),
    ),
  );

export default [createGroupEpic, updateGroupEpic];
