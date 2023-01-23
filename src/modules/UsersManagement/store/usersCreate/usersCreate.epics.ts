import { Epic } from 'redux-observable';
import { catchError, switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers, MessageType, TAnyResponseError } from '@alycecom/services';
import { Action } from 'redux';
import { v4 } from 'uuid';

import { refreshUsersRequest } from '../users/users.actions';
import { setUsersSidebarStep } from '../usersOperation/usersOperation.actions';
import { UsersSidebarStep } from '../usersOperation/usersOperation.types';
import { addUserDrafts } from '../entities/userDrafts/userDrafts.actions';
import { getUserDrafts } from '../entities/userDrafts';
import { MAX_USERS_AMOUNT_FOR_SINGLE_CREATE_FLOW } from '../../constants/bulkCreate.constants';
import { waitForBulkCreateUsers } from '../bulkCreate/bulkCreate.actions';

import {
  createUserRequest,
  createUserFail,
  validateUserInfoRequest,
  validateUserInfoSuccess,
  validateUserInfoFail,
} from './usersCreate.actions';

export const validateUserInfoEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(validateUserInfoRequest),
    switchMap(({ payload, meta: shouldGoNextPage = false }) =>
      apiService.post('/api/v1/users/validate', { body: { ...payload } }, true).pipe(
        mergeMap(() => {
          const userId = v4();
          const actions: Action[] = [
            validateUserInfoSuccess(),
            addUserDrafts({ users: { [userId]: { ...payload, id: userId, isWhitelistedDomain: false } } }),
          ];
          if (shouldGoNextPage) {
            actions.push(setUsersSidebarStep(UsersSidebarStep.assignRoles));
          }
          return actions;
        }),
        catchError(
          handleError(
            handlers.handleAnyError(
              (
                data: Partial<Record<string | number, string[]>>,
                errors: TAnyResponseError & {
                  data?: { userId?: number | undefined } | undefined;
                },
              ) => validateUserInfoFail(data, errors?.data?.userId),
            ),
          ),
        ),
      ),
    ),
  );

export const createUsersEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(createUserRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const users = getUserDrafts(state);
      const isBulkUpload = users.length > MAX_USERS_AMOUNT_FOR_SINGLE_CREATE_FLOW;
      const apiUrl = `/api/v1/users/${isBulkUpload ? 'bulk-create' : 'add'}`;
      const importId = v4();
      return apiService.post(apiUrl, { body: { ...payload, users, importId } }, true).pipe(
        mergeMap(() => {
          let actions: Action[] = [setUsersSidebarStep(null)];
          if (isBulkUpload) {
            actions = [
              ...actions,
              waitForBulkCreateUsers({ importId }),
              showGlobalMessage({
                text: `We will notify and email you when all members will be created.`,
                type: MessageType.Success,
              }),
            ];
          } else {
            actions = [
              ...actions,
              refreshUsersRequest(),
              showGlobalMessage({
                text: `Success! You added ${users.length > 1 ? 'new users' : 'a new user'}.`,
                type: MessageType.Success,
              }),
            ];
          }
          return actions;
        }),
        catchError(handleError(handlers.handleAnyError(createUserFail))),
      );
    }),
  );

export const usersCreateEpics = [validateUserInfoEpic, createUsersEpic];
