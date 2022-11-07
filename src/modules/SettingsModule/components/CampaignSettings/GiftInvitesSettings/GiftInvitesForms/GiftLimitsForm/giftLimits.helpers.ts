import { IGiftLimit } from '../../../../../store/campaign/giftLimits/giftLimits.types';

export const getUserLimitsIds = (users: IGiftLimit[]): number[] => users.map(user => user.user_id);

export const getIsUserLimitSelected = (selectedUsers: IGiftLimit[], userLimit: IGiftLimit): boolean => {
  const userIds = getUserLimitsIds(selectedUsers);
  return userIds.includes(userLimit.user_id);
};
