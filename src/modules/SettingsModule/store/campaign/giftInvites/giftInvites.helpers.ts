import { map } from 'ramda';

import { IGiftType } from './giftInvites.types';

export const updateSelectedAllGiftTypes = (isAllNotRestricted: boolean): ((list: IGiftType[]) => IGiftType[]) =>
  map<IGiftType, IGiftType>(giftType => ({
    ...giftType,
    is_campaign_restricted:
      giftType.is_team_restricted || giftType.countryIds.length === 0
        ? giftType.is_campaign_restricted
        : isAllNotRestricted,
  }));
