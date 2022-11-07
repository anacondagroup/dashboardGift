import { createSelector } from 'reselect';
import { intersection } from 'ramda';
import { User } from '@alycecom/modules';

import { getUsers } from './users/users.selectors';
import { getSelectedUsers, getSingleSelectedUser } from './usersOperation/usersOperation.selectors';
import { getUserIds } from './usersManagement.helpers';

export const getCurrentActionUsers = createSelector(
  getSingleSelectedUser,
  getSelectedUsers,
  (singleSelectedUser, selectedUsers) => (singleSelectedUser ? [singleSelectedUser] : selectedUsers),
);

export const getIsCurrentUserSelected = createSelector(
  User.selectors.getUserId,
  getCurrentActionUsers,
  (loggedUserId, selectedUsers) => selectedUsers.some(user => user.id === loggedUserId),
);

export const getIsLastAdminSelected = createSelector(getCurrentActionUsers, selectedUsers =>
  selectedUsers.some(user => user.isLastAdmin),
);

export const getPageSelectedUsersCount = createSelector(getUsers, getSelectedUsers, (pageUsers, selectedUsers) => {
  const pageUsersIds = getUserIds(pageUsers);
  const selectedUsersIds = getUserIds(selectedUsers);
  const pageSelectedUserIds = intersection(pageUsersIds, selectedUsersIds);
  return pageSelectedUserIds.length;
});
