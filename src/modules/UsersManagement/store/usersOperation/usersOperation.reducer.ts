import { createReducer } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IUser } from '../usersManagement.types';
import { getUserIds } from '../usersManagement.helpers';

import {
  assignUsersToTeamsFail,
  assignUsersToTeamsRequest,
  assignUsersToTeamsSuccess,
  toggleUsersSelections,
  setSingleSelectedUser,
  toggleUserSelection,
  setAssignToTeamModalStatus,
  setRemoveFromTeamModalStatus,
  setUsersSidebarStep,
  makeUserAsAdminRequest,
  makeUserAsAdminSuccess,
  makeUserAsAdminFail,
  setResendInvitesToUsersModalStatus,
  resendInvitesToUsersRequest,
  resendInvitesToUsersSuccess,
  resendInvitesToUsersFail,
  exportSelectedUsersRequest,
  exportSelectedUsersSuccess,
  exportSelectedUsersFail,
  updateUsersRequest,
  updateUsersSuccess,
  updateUsersFail,
  resetSelectedUsers,
  resendPendingInvitationMails,
} from './usersOperation.actions';
import { UsersSidebarStep } from './usersOperation.types';

export interface IUsersOperationState {
  isAssignToTeamModalOpened: boolean;
  isRemoveFromTeamModalOpened: boolean;
  isResendInvitesModalOpened: boolean;
  prevUsersSidebarStep: UsersSidebarStep | null;
  usersSidebarStep: UsersSidebarStep | null;
  isOperationPending: boolean;
  singleSelectedUser: IUser | null;
  selectedUsers: IUser[];
  isSelectAllSectionVisible: boolean;
  errors: TErrors;
}

export const initialUsersOperationState: IUsersOperationState = {
  isAssignToTeamModalOpened: false,
  isRemoveFromTeamModalOpened: false,
  isResendInvitesModalOpened: false,
  prevUsersSidebarStep: null,
  usersSidebarStep: null,
  isOperationPending: false,
  singleSelectedUser: null,
  selectedUsers: [],
  isSelectAllSectionVisible: false,
  errors: {},
};

export const usersOperation = createReducer<IUsersOperationState>({}, initialUsersOperationState);

usersOperation
  .on(assignUsersToTeamsRequest, state => ({
    ...state,
    isOperationPending: true,
  }))
  .on(assignUsersToTeamsSuccess, state => ({
    ...state,
    isOperationPending: false,
  }))
  .on(assignUsersToTeamsFail, (state, payload) => ({
    ...state,
    isOperationPending: false,
    errors: payload,
  }));

usersOperation
  .on(setSingleSelectedUser, (state, payload) => ({
    ...state,
    singleSelectedUser: payload,
  }))
  .on(setAssignToTeamModalStatus, (state, payload) => ({
    ...state,
    isAssignToTeamModalOpened: payload,
  }))
  .on(setRemoveFromTeamModalStatus, (state, payload) => ({
    ...state,
    isRemoveFromTeamModalOpened: payload,
  }))
  .on(setUsersSidebarStep, (state, payload) => ({
    ...state,
    prevUsersSidebarStep: payload ? state.usersSidebarStep : null,
    usersSidebarStep: payload,
  }))
  .on(toggleUserSelection, (state, { user, checked }) => ({
    ...state,
    selectedUsers: checked ? [...state.selectedUsers, user] : state.selectedUsers.filter(item => item.id !== user.id),
    isSelectAllSectionVisible: false,
  }))
  .on(toggleUsersSelections, (state, { users, checked }) => {
    const userIds = getUserIds(users);
    const selectedUserIds = getUserIds(state.selectedUsers);
    const selectedUsers = checked
      ? [...state.selectedUsers, ...users.filter(item => !selectedUserIds.includes(item.id))]
      : state.selectedUsers.filter(item => !userIds.includes(item.id));
    return {
      ...state,
      selectedUsers,
      isSelectAllSectionVisible: checked,
    };
  })
  .on(resetSelectedUsers, state => ({
    ...state,
    selectedUsers: [],
    isSelectAllSectionVisible: false,
  }));

usersOperation
  .on(makeUserAsAdminRequest, state => ({
    ...state,
    isOperationPending: true,
  }))
  .on(makeUserAsAdminSuccess, state => ({
    ...state,
    isOperationPending: false,
  }))
  .on(makeUserAsAdminFail, (state, payload) => ({
    ...state,
    isOperationPending: false,
    errors: payload,
  }));

usersOperation
  .on(setResendInvitesToUsersModalStatus, (state, payload) => ({
    ...state,
    isResendInvitesModalOpened: payload,
  }))
  .on(resendInvitesToUsersRequest, state => ({
    ...state,
    isOperationPending: true,
  }))
  .on(resendInvitesToUsersSuccess, state => ({
    ...state,
    isOperationPending: false,
  }))
  .on(resendInvitesToUsersFail, (state, payload) => ({
    ...state,
    isOperationPending: false,
    errors: payload,
  }));

usersOperation
  .on(resendPendingInvitationMails.pending, state => ({
    ...state,
    isOperationPending: true,
  }))
  .on(resendPendingInvitationMails.fulfilled, state => ({
    ...state,
    isOperationPending: false,
  }))
  .on(resendPendingInvitationMails.rejected, (state, payload) => ({
    ...state,
    isOperationPending: false,
    errors: payload,
  }));

usersOperation
  .on(exportSelectedUsersRequest, state => ({
    ...state,
    isOperationPending: true,
  }))
  .on(exportSelectedUsersSuccess, state => ({
    ...state,
    isOperationPending: false,
  }))
  .on(exportSelectedUsersFail, (state, payload) => ({
    ...state,
    isOperationPending: false,
    errors: payload,
  }));

usersOperation
  .on(updateUsersRequest, state => ({
    ...state,
    isOperationPending: true,
  }))
  .on(updateUsersSuccess, state => ({
    ...state,
    isOperationPending: false,
  }))
  .on(updateUsersFail, (state, payload) => ({
    ...state,
    isOperationPending: false,
    errors: payload,
  }));
