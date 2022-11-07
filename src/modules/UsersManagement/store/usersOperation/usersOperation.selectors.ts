import { pipe } from 'ramda';
import { createSelector } from 'reselect';
import { User } from '@alycecom/modules';

import { IRootState } from '../../../../store/root.types';

import { UsersSidebarStep } from './usersOperation.types';

const pathToUsersState = (state: IRootState) => state.usersManagement.usersOperation;

export const getIsOperationPending = pipe(pathToUsersState, state => state.isOperationPending);

export const getSelectedUsers = pipe(pathToUsersState, state => state.selectedUsers);

export const getIsAssignToTeamModalOpen = pipe(pathToUsersState, state => state.isAssignToTeamModalOpened);

export const getIsRemoveFromTeamModalOpen = pipe(pathToUsersState, state => state.isRemoveFromTeamModalOpened);

export const getSingleSelectedUser = pipe(pathToUsersState, state => state.singleSelectedUser);

export const getIsCurrentUserSelected = createSelector(
  getSingleSelectedUser,
  User.selectors.getUserId,
  (selectedUser, loggedUserId) => selectedUser?.id === loggedUserId,
);

export const getErrors = pipe(pathToUsersState, state => state.errors);

export const getIsUsersSidebarOpen = pipe(pathToUsersState, state => state.usersSidebarStep !== null);

export const getUsersSidebarStep = pipe(pathToUsersState, state => state.usersSidebarStep);

export const getIsResendInvitesToUsersModalOpen = pipe(pathToUsersState, state => state.isResendInvitesModalOpened);

export const getSingleSelectedUserRole = pipe(pathToUsersState, state => state.isResendInvitesModalOpened);

export const getPrevUsersSidebarStep = pipe(pathToUsersState, state => state.prevUsersSidebarStep);

export const getIsBulkFlow = createSelector(
  getPrevUsersSidebarStep,
  step => step === UsersSidebarStep.importedUsersInfo,
);

export const getIsSelectAllSectionVisible = pipe(pathToUsersState, state => state.isSelectAllSectionVisible);
