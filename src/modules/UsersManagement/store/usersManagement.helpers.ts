import { IUser } from './usersManagement.types';

export const getUserIds = (users: IUser[]): number[] => users.map(user => user.id);

export const getIsUserSelected = (selectedUsers: IUser[], user: IUser): boolean => {
  const userIds = getUserIds(selectedUsers);
  return userIds.includes(user.id);
};
