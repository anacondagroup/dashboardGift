import { GiftLimitPeriod } from './giftLimits.types';

export const GIFT_LIMITS_TOTAL_PER_PAGE = 30;

export const PERIOD_TO_LABEL = {
  [GiftLimitPeriod.Day]: 'Resets daily',
  [GiftLimitPeriod.Week]: 'Resets weekly',
  [GiftLimitPeriod.Month]: 'Resets monthly',
  [GiftLimitPeriod.Quarter]: 'Resets quarterly',
  [GiftLimitPeriod.Infinite]: 'Resets never',
};
