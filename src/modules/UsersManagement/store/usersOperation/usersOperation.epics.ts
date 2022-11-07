import { Epic } from 'redux-observable';
import { catchError, switchMap, mergeMap, withLatestFrom, tap, filter, map } from 'rxjs/operators';
import { ofType, queryParamsBuilder } from '@alycecom/utils';
import { handleError, handlers, MessageType, TrackEvent } from '@alycecom/services';

import {
  refreshUsersRequest,
  resetIsAllSelected,
  setIsAllSelected,
  setUserAsAdmin,
  setUserAsMember,
} from '../users/users.actions';
import { getUserIds } from '../usersManagement.helpers';
import { getCurrentActionUsers } from '../usersManagement.selectors';
import { resetUserDrafts } from '../entities/userDrafts/userDrafts.actions';
import { resetUsersCreateData } from '../usersCreate/usersCreate.actions';
import { getLastFilters, getUsersMeta } from '../users/users.selectors';
import { IRequestUsersParams } from '../usersManagement.types';

import {
  toggleUsersSelections,
  resetSelectedUsers,
  assignUsersToTeamsFail,
  assignUsersToTeamsRequest,
  assignUsersToTeamsSuccess,
  setSingleSelectedUser,
  setAssignToTeamModalStatus,
  removeUserFromTeamsRequest,
  setRemoveFromTeamModalStatus,
  removeUsersFromTeamsSuccess,
  removeUsersFromTeamsFail,
  makeUserAsAdminRequest,
  makeUserAsAdminFail,
  makeUserAsAdminSuccess,
  setResendInvitesToUsersModalStatus,
  resendInvitesToUsersRequest,
  resendInvitesToUsersSuccess,
  resendInvitesToUsersFail,
  exportSelectedUsersRequest,
  exportSelectedUsersSuccess,
  exportSelectedUsersFail,
  updateUsersRequest,
  updateUsersFail,
  updateUsersSuccess,
  setUsersSidebarStep,
  makeUserAsMemberRequest,
  makeUserAsMemberSuccess,
  makeUserAsMemberFail,
  toggleUserSelection,
  resendPendingInvitationMails,
} from './usersOperation.actions';

const prepareFilterParams = ({ isAllSelected, search, teamId }: IRequestUsersParams): Partial<IRequestUsersParams> =>
  isAllSelected ? { isAllSelected, search, teamId } : {};

export const assignUsersToTeamsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(assignUsersToTeamsRequest),
    withLatestFrom(state$),
    switchMap(([{ payload: teamIds }, state]) => {
      const userIds = getUserIds(getCurrentActionUsers(state));
      const filters = prepareFilterParams(getLastFilters(state));
      return apiService.post('/api/v1/users/move', { body: { teamIds, userIds, ...filters } }, true).pipe(
        mergeMap(() => [
          assignUsersToTeamsSuccess(),
          setAssignToTeamModalStatus(false),
          resetSelectedUsers(),
          refreshUsersRequest(),
          showGlobalMessage({ text: 'User(s) are assigned to a team.', type: MessageType.Success }),
        ]),
        catchError(handleError(handlers.handleAnyError(assignUsersToTeamsFail))),
      );
    }),
  );

export const removeUsersFromTeamsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(removeUserFromTeamsRequest),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const userIds = getUserIds(getCurrentActionUsers(state));
      const filters = prepareFilterParams(getLastFilters(state));
      return apiService.post('/api/v1/users/remove', { body: { userIds, ...filters } }, true).pipe(
        mergeMap(() => [
          removeUsersFromTeamsSuccess(),
          setRemoveFromTeamModalStatus(false),
          resetSelectedUsers(),
          refreshUsersRequest(),
          showGlobalMessage({ text: 'User(s) are removed from team(s).', type: MessageType.Success }),
        ]),
        catchError(handleError(handlers.handleAnyError(removeUsersFromTeamsFail))),
      );
    }),
  );

export const makeUsersAsAdminEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(makeUserAsAdminRequest),
    switchMap(({ payload }) =>
      apiService.put(`/api/v1/users/${payload}/make-admin`, {}, true).pipe(
        mergeMap(() => [
          makeUserAsAdminSuccess(),
          setUserAsAdmin(payload),
          resetSelectedUsers(),
          refreshUsersRequest(),
          showGlobalMessage({ text: 'This user has been granted admin rights.', type: MessageType.Success }),
        ]),
        catchError(handleError(handlers.handleAnyError(makeUserAsAdminFail))),
      ),
    ),
  );

export const makeUserAsMemberEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(makeUserAsMemberRequest),
    switchMap(({ payload }) =>
      apiService.put(`/api/v1/users/${payload.userId}/make-member`, {}, true).pipe(
        mergeMap(() => [
          makeUserAsMemberSuccess(),
          setUserAsMember(payload.userId),
          resetSelectedUsers(),
          refreshUsersRequest(),
          showGlobalMessage({ text: 'Admin rights has been revoked for this user.', type: MessageType.Success }),
        ]),
        catchError(handleError(handlers.handleAnyError(makeUserAsMemberFail))),
      ),
    ),
  );

export const resendInvitesToUsersEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(resendInvitesToUsersRequest),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const userIds = getUserIds(getCurrentActionUsers(state));
      const successText = userIds.length > 1 ? 'Invitations are resent.' : 'Invitation is resent.';
      const filters = prepareFilterParams(getLastFilters(state));
      return apiService.post('/api/v1/users/resend-invite', { body: { userIds, ...filters } }, true).pipe(
        mergeMap(() => [
          resendInvitesToUsersSuccess(),
          setResendInvitesToUsersModalStatus(false),
          resetSelectedUsers(),
          showGlobalMessage({ text: successText, type: MessageType.Success }),
        ]),
        catchError(handleError(handlers.handleAnyError(resendInvitesToUsersFail))),
      );
    }),
  );

export const resendPendingInvitationMailsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(resendPendingInvitationMails.pending),
    switchMap(({ payload }) => {
      const usersMeta = getUsersMeta(state$.value);
      return apiService
        .post('/api/v1/users/resend-invite', { body: { userIds: payload.userIds, isAllSelected: false } }, true)
        .pipe(
          mergeMap(() => [
            resendPendingInvitationMails.fulfilled(),
            showGlobalMessage({ text: 'Invitations were resent.', type: MessageType.Success }),
            TrackEvent.actions.trackEvent({
              name: 'Pending users invitations — send invites clicked',
              payload: { numberOfUsers: usersMeta.pendingInvitationUsers.length },
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(resendPendingInvitationMails.rejected))),
        );
    }),
  );

export const exportSelectedUsersEpic: Epic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    ofType(exportSelectedUsersRequest),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const userIds = getUserIds(getCurrentActionUsers(state));
      const filters = prepareFilterParams(getLastFilters(state));
      const url = `/api/v1/users/export?${queryParamsBuilder({ userIds, ...filters })}`;
      return apiService.getFile(url).pipe(
        tap(blob => {
          downloadFile(blob, 'users.xlsx');
        }),
        mergeMap(() => [exportSelectedUsersSuccess(), resetSelectedUsers(), resetIsAllSelected()]),
        catchError(handleError(handlers.handleAnyError(exportSelectedUsersFail))),
      );
    }),
  );

export const updateUsersEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateUsersRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const userIds = getUserIds(getCurrentActionUsers(state));
      return apiService.put('/api/v1/users/edit', { body: { userIds, ...payload } }, true).pipe(
        mergeMap(() => [
          updateUsersSuccess(),
          setUsersSidebarStep(null),
          setSingleSelectedUser(null),
          refreshUsersRequest(),
          showGlobalMessage({ text: 'User has been updated successfully.', type: MessageType.Success }),
        ]),
        catchError(handleError(handlers.handleAnyError(updateUsersFail))),
      );
    }),
  );

export const closeSidebarEpic: Epic = action$ =>
  action$.pipe(
    ofType(setUsersSidebarStep),
    filter(({ payload }) => payload === null),
    mergeMap(() => [resetUserDrafts(), resetUsersCreateData()]),
  );

export const clearSelectionAllItemsEpic: Epic = action$ =>
  action$.pipe(
    ofType(setIsAllSelected),
    filter(({ payload }) => payload === false),
    map(() => resetSelectedUsers()),
  );

export const singleUserSelectEpic: Epic = action$ =>
  action$.pipe(
    ofType(toggleUserSelection),
    map(() => resetIsAllSelected()),
  );

export const bulkUsersSelectEpic: Epic = action$ =>
  action$.pipe(
    ofType(toggleUsersSelections),
    filter(({ payload }) => payload.users.length === 0),
    map(() => resetIsAllSelected()),
  );

export const usersOperationEpics = [
  assignUsersToTeamsEpic,
  removeUsersFromTeamsEpic,
  makeUsersAsAdminEpic,
  makeUserAsMemberEpic,
  resendInvitesToUsersEpic,
  resendPendingInvitationMailsEpic,
  exportSelectedUsersEpic,
  updateUsersEpic,
  closeSidebarEpic,
  clearSelectionAllItemsEpic,
  singleUserSelectEpic,
  bulkUsersSelectEpic,
];
