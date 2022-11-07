import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { createAsyncAction } from '@alycecom/utils';

import { IUpsertUsersParams, IUser } from '../usersManagement.types';

import { UsersSidebarStep } from './usersOperation.types';

const PREFIX = 'USERS_MANAGEMENT/USERS_OPERATION';

export const setAssignToTeamModalStatus = createAction<boolean>(`${PREFIX}/SET_ASSIGN_TO_TEAM_MODAL_STATUS`);

export const assignUsersToTeamsRequest = createAction<number[]>(`${PREFIX}/ASSIGN_USERS_TO_TEAMS_REQUEST`);
export const assignUsersToTeamsSuccess = createAction<void>(`${PREFIX}/ASSIGN_USERS_TO_TEAMS_SUCCESS`);
export const assignUsersToTeamsFail = createAction<TErrors>(`${PREFIX}/ASSIGN_USERS_TO_TEAMS_FAIL`);

export const setRemoveFromTeamModalStatus = createAction<boolean>(`${PREFIX}/SET_REMOVE_FROM_TEAM_MODAL_STATUS`);

export const removeUserFromTeamsRequest = createAction<void>(`${PREFIX}/REMOVE_USERS_FROM_TEAMS_REQUEST`);
export const removeUsersFromTeamsSuccess = createAction<void>(`${PREFIX}/REMOVE_USERS_FROM_TEAMS_SUCCESS`);
export const removeUsersFromTeamsFail = createAction<TErrors>(`${PREFIX}/REMOVE_USERS_FROM_TEAMS_FAIL`);

export const toggleUserSelection = createAction<{ user: IUser; checked: boolean }>(`${PREFIX}/TOGGLE_USER_SELECTION`);
export const toggleUsersSelections = createAction<{ users: IUser[]; checked: boolean }>(
  `${PREFIX}/TOGGLE_USERS_SELECTION`,
);
export const resetSelectedUsers = createAction(`${PREFIX}/RESET_SELECTED_USERS`);
export const setSingleSelectedUser = createAction<IUser | null>(`${PREFIX}/SET_SINGLE_SELECTED_USER`);

export const setUsersSidebarStep = createAction<UsersSidebarStep | null>(`${PREFIX}/SET_USERS_SIDEBAR_STEP`);

export const makeUserAsAdminRequest = createAction<number>(`${PREFIX}/MAKE_USER_AS_ADMIN_REQUEST`);
export const makeUserAsAdminSuccess = createAction(`${PREFIX}/MAKE_USER_AS_ADMIN_SUCCESS`);
export const makeUserAsAdminFail = createAction<TErrors>(`${PREFIX}/MAKE_USER_AS_ADMIN_FAIL`);

export const makeUserAsMemberRequest = createAction<{ userId: number }>(`${PREFIX}/MAKE_USER_AS_MEMBER_REQUEST`);
export const makeUserAsMemberSuccess = createAction(`${PREFIX}/MAKE_USER_AS_MEMBER_SUCCESS`);
export const makeUserAsMemberFail = createAction<TErrors>(`${PREFIX}/MAKE_USER_AS_MEMBER_FAIL`);

export const setResendInvitesToUsersModalStatus = createAction<boolean>(
  `${PREFIX}/SET_RESEND_INVITES_TO_USERS_MODAL_STATUS`,
);
export const resendInvitesToUsersRequest = createAction<void>(`${PREFIX}/RESEND_INVITES_TO_USERS_REQUEST`);
export const resendInvitesToUsersSuccess = createAction<void>(`${PREFIX}/RESEND_INVITES_TO_USERS_SUCCESS`);
export const resendInvitesToUsersFail = createAction<TErrors>(`${PREFIX}/RESEND_INVITES_TO_USERS_FAIL`);

export const resendPendingInvitationMails = createAsyncAction<{ userIds: number[] }, void, TErrors>(
  `${PREFIX}/RESEND_PENDING_INVITATION_MAILS_REQUEST`,
);

export const exportSelectedUsersRequest = createAction<void>(`${PREFIX}/EXPORT_SELECTED_USERS_REQUEST`);
export const exportSelectedUsersSuccess = createAction<void>(`${PREFIX}/EXPORT_SELECTED_USERS_SUCCESS`);
export const exportSelectedUsersFail = createAction<TErrors>(`${PREFIX}/EXPORT_SELECTED_USERS_FAIL`);

export const updateUsersRequest = createAction<IUpsertUsersParams>(`${PREFIX}/UPDATE_USERS_REQUEST`);
export const updateUsersSuccess = createAction<void>(`${PREFIX}/UPDATE_USERS_SUCCESS`);
export const updateUsersFail = createAction<TErrors>(`${PREFIX}/UPDATE_USERS_FAIL`);
